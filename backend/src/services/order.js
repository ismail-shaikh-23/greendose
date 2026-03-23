const db = require('../models');

const { NoDataFoundError, BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError');
const handleSuccess = require('../../utils/successHandler');
const commonFunctions = require('../../utils/commonFunctions');
const { deliveryStatusTrack } = require('../../config/deliveryStatus');
const { sequelize, Sequelize } = db;
const { Op } = require('sequelize');
const { getPagination } = require('../../utils/pagination');
const { deliveryEnum } = require('../../utils/deliveryStatus');
const { getAppConfig } = require('../../utils/redisConstants');
const { createOrdersReport } = require('../services/report');
const { generateInvoice, createInvoicePDF } = require('../../utils/invoicePdf');

exports.createOrder = async (customerId, addressId) => {
    const checkIfAddressExist = await commonFunctions.findOne('address', { condition: { id: addressId, customerId } });
    if(!checkIfAddressExist){
        throw new BadRequestError('No address Found Associated with this customer');
    }
    const transaction = await sequelize.transaction({ 
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ 
    });
    const options = {};
    options.condition = {
        customerId
    }
    options.include = [
        {
            model: db.cartItem,
            as: 'cartItems'
        }
    ]
    options.attributes = ['id', 'subTotal', 'total','deliveryFee','handlingCharges'];
    const cartExist = await commonFunctions.findOne('cart', options);
    if(!cartExist){
        await transaction.rollback();
        throw new BadRequestError(`Please login as a customer`);
    }

    if(cartExist.cartItems.length === 0){
        await transaction.rollback();
        throw new BadRequestError(`Please add item in the cart for placing an order`)
    }
    const badProducts = [];
    const productsData = [];

    for (const data of cartExist?.cartItems || []) {
        const product = await commonFunctions.findOne('product', { condition: { id: data.productId } });

        if (!product) {
            await transaction.rollback();
            throw new BadRequestError(`Invalid Product Id: ${data.productId}`);
        }

        if (product.quantity < data.quantity) {
            badProducts.push(
            `The product "${product.name}" has only ${product.quantity} left. Please remove ${data.quantity - product.quantity} item(s) to place your order.`
            );
            productsData.push({ id: product.id, quantity:product.quantity });
        } 
        else {
            const updatedQuantity = product.quantity - data.quantity;
            await commonFunctions.updateWithTransaction('product', { id: product.id }, { quantity: updatedQuantity }, transaction);
        }
    }

    if (badProducts.length > 0) {
        await transaction.rollback();
        return { fault: true, error:`Invalid Product Quantities: ${badProducts.join(', ')}`, products: productsData };
        // throw new BadRequestError(`Invalid Product Quantities: ${badProducts.join(', ')}`,productsData);
    }

    
    options.condition = { cartId: cartExist.id };
    const discount = await commonFunctions.sum('cartItem', 'discount', options);
    const quantity = await commonFunctions.sum('cartItem', 'quantity', options);

    // calculate commission fee from app setting
    const commissionDetails = await commonFunctions.findOne('appSetting', { condition: { key: 'comissionFee', isActive: true }});
    const commissionFee = parseFloat((cartExist.subTotal * (commissionDetails?.value | 0)) / 100);
    
    // add entry into the order table
    const orderData = {
        customerId,
        cartId: cartExist.id,
        quantity,
        totalAmount: Number(cartExist.total) + Number(commissionFee),
        subTotal: Number(cartExist.subTotal) + Number(commissionFee),
        discount,
        commissionFee,
        deliveryFee: Number(cartExist.deliveryFee),
        handlingFee: Number(cartExist.handlingCharges),
        addressId
    }
    const createOrder = await commonFunctions.create('order', orderData);
    if (!createOrder) {
        await transaction.rollback();
        throw new InternalServerError('Internal server error');
    }

    // add entry into the order details table
    options.attributes = ['id', 'unitPrice', 'discount', 'totalPrice', 'quantity'];
    options.include = [
        {
            model: db.product,
            as: 'product',
            attributes: ['id', 'name', 'description', 'expiryDate', 'vendorId']
        }
    ]
    let cartItems = await commonFunctions.findAll('cartItem', options);
    cartItems = cartItems.rows;
    if(cartItems.length === 0){
        await transaction.rollback();
        throw new BadRequestError('Cart is empty please add products');
    }
    let orderDeliveryData = [];
    for(let i=0;i<cartItems.length;i++){
        const orderDetailBody = {
            orderId: createOrder.id,
            productId: cartItems[i].product?.id,
            productName: cartItems[i].product?.name,
            productDescription: cartItems[i].product?.description,
            productPrice: Number(cartItems[i].unitPrice),
            productQuantity: cartItems[i].quantity,
            productDiscount: Number(cartItems[i].discount),
            productExpiryDate: cartItems[i].product?.expiryDate,
            totalPrice: Number(cartItems[i].totalPrice),
            vendorId: cartItems[i].product?.vendorId
        }
        
        const addOrderDetails = await commonFunctions.create('orderDetail', orderDetailBody);
        if(!addOrderDetails){
            await transaction.rollback();
            throw new InternalServerError('Internal server error');
        }
        orderDeliveryData.push({ orderDetailsId: addOrderDetails.id });
    }

    // add order delivery history entry
    const orderDeliveryEntry = await commonFunctions.create('orderDeliveryHistory', orderDeliveryData, isBulk = true);
    if(!orderDeliveryEntry || orderDeliveryEntry.length === 0){
        await transaction.rollback();
        throw new InternalServerError('Internal server error');
    }

    // create order tansaction
    const ordersTransaction = await commonFunctions.create('orderTransaction', {
        orderId: createOrder.id,
        status: 'pending'
    });
    if (!ordersTransaction) {
        await transaction.rollback();
        throw new InternalServerError('Internal server error');
    }

    // create initial order status
    const orderStatusHistory = await commonFunctions.create('orderStatusHistory', {
        orderId: createOrder.id,
        remarks: 'Initial status for placed order',
    });
    if (!orderStatusHistory) {
        await transaction.rollback();
        throw new InternalServerError('Internal server error');
    }

    // delete user's cart item
    cartExist.deletedAt = Date.now();
    await commonFunctions.destroy('cartItem', { cartId: cartExist.id });

    // empty cart
    const cartData = {
        subTotal: 0,
        total: 0,
        discount: 0,
        handlingCharges: 0,
        deliveryFee: 0
    }
    await commonFunctions.update("cart", { customerId }, cartData);

    await transaction.commit();
    return handleSuccess('Order created successfully', createOrder);
};

exports.getOrderWithDetailsById = async (id, vendorId) => {
    if (!id) {
        throw new BadRequestError('Order id is required');
    }
    const options = {};
    options.condition = { id };
    options.include = [
        {
            model: db.customer,
            as: 'customer',
            attributes: ["id", "firstName", "lastName", "email"]
        },
        {
            model: db.orderStatusHistory,
            as: 'orderStatusHistory',
            attributes: [
                "status", 
                "remarks",
            ],
            include: {
                model: db.user,
                as: 'user',
                attributes: ["id", "firstName", "lastName", "email"]
            }
        },
        {
            model: db.orderDetail,
            as: 'orderDetails',
            separate: true,
            where: {
                ...( vendorId ? { vendorId } : {} )
            },
            required: true,
            attributes: ["id", "productId", "productName", 'productDescription', 'productQuantity', 'deliveryStatus', 'productExpiryDate', 'invoiceNumber'],
            include: [
                {
                    model: db.orderDeliveryHistory,
                    as: 'deliveryHistory',
                    attributes: ["status", "isCurrentActive", "createdAt"],
                    include: {
                        model: db.user,
                        attributes: ["id", "firstName", "lastName", "email"]
                    }
                },
            ]
        }
    ];
    options.attributes = ["id", "orderNumber", "quantity", "totalAmount", "subTotal", "discount", "paymentStatus", "invoiceNumber"];

    const orderDetails = await commonFunctions.findOne('order', options);
    if (!orderDetails) {
        throw new NoDataFoundError(`Order with id ${id} not found`);
    }

    return handleSuccess('Order fetched successfully', orderDetails);
};

exports.fetchDeliveryStatus = async (id) => {
    if (!id) {
        throw new BadRequestError('Order id is required');
    }
    const options = {};
    options.condition = { id };
    options.include = [
        {
            model: db.orderDetail,
            as: 'orderDetails',
            attributes: ["productId", "productName", "productPrice", "productQuantity", "deliveryStatus"],
            include: {
                model: db.orderDeliveryHistory,
                as: 'deliveryHistory',
                attributes: ["status", "isCurrentActive"],
                include: {
                    model: db.user,
                    attributes: ["firstName", "lastName", "userName"]
                }
            }
        }
    ];
    options.attributes = ["id", "orderNumber", "quantity", "totalAmount", "subTotal", "discount", "paymentStatus", "invoiceNumber"];

    const orderDetails = await commonFunctions.findOne('order', options);
    if (!orderDetails) {
        throw new NoDataFoundError(`Order with id ${id} not found`);
    }

    return handleSuccess('Order fetched successfully', orderDetails);
};

exports.updateOrderStatus = async (id, updateBody) => {
    const updateStatus = await commonFunctions.update('orderStatusHistory', { orderId: id }, updateBody);
    if (updateStatus[0] === 0) {
        throw new InternalServerError('Internal server error');
    }

    return handleSuccess('Order status updated successfully');
};

exports.modifyPaymentStatus = async (id, updateBody) => {
    const updateStatus = await commonFunctions.update('order', { id }, updateBody);
      if (updateStatus[0] === 0) {
        throw new InternalServerError('Internal server error');
    }

    return handleSuccess('Order payment status updated successfully');
};

exports.modifyDeliveryStatus = async (id, vendorId, updateBody) => {
    let options = {};
    options.condition = { 
        id,
        ...(vendorId ? { vendorId } : {} ) // for vendor role he should only update his product's order
    };
    options.include = [
        {
            model: db.order,
            as: 'order',
            attributes: ['customerId']
        },
    ];
    options.attributes = ['productId', 'vendorId'];
    const orderDetails = await commonFunctions.findByPk('orderDetail', id, options);
    if(!orderDetails){
        throw new BadRequestError(`Order details not found with id ${id}`);
    }
    const { status, updatedBy } = updateBody
    const transaction = await sequelize.transaction({ 
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ 
    });

    // handle delivery cancel case.
    if(status === 'cancelled'){
        const createNewStatus = await handleCancelStatusUpdate(id, status, updatedBy, transaction);
        return handleSuccess('Order status updated successfully', createNewStatus);
    }
    options = {};
    options.condition = {
        orderDetailsId: id,
        isCurrentActive: true
    }
    options.attributes = ['id', 'status'];
    
    const currentDeliveryStatus = await commonFunctions.findOne('orderDeliveryHistory', options);
    if (!currentDeliveryStatus) {
        await transaction.rollback();
        throw new NoDataFoundError('Order Status not found');
    } 

    // handling to prevent reverse order delivery modification for order status.
    if (deliveryStatusTrack[currentDeliveryStatus.status] + 1 !== deliveryStatusTrack[status]) {
        await transaction.rollback();
        throw new BadRequestError('Please update delivery status in order.')
    }

    // update delivery status in order details
    await commonFunctions.update('orderDetail', { id }, { deliveryStatus: status });

    // update the delivery status in delivery hiostory table
    await commonFunctions.update("orderDeliveryHistory", { id: currentDeliveryStatus.id }, { isCurrentActive: false });

    // add new entry into the delivery status
    const deliveryStatusBody = {
        orderDetailsId: id,
        status,
        updatedBy,
        isCurrentActive: true
    };
    const createNewStatus = await commonFunctions.create('orderDeliveryHistory', deliveryStatusBody, false, transaction);
    if (!createNewStatus) {
        await transaction.rollback();
        throw new InternalServerError('Internal server error');
    }

    // add invoice when order status is delivered
    if(status === 'delivered'){
        const invoiceData = {
            orderDetailsId: id,
            customerId: orderDetails.order?.customerId,
            vendorId: orderDetails.vendorId,
            productId: orderDetails.productId,
        };
        const createInvoice = await commonFunctions.create('invoice', invoiceData);
        if(!createInvoice){
            await transaction.rollback();
            throw new InternalServerError('Internal server error');
        }

        // add invoice number in order details table
        await commonFunctions.update('orderDetail', { id }, { invoiceNumber: createInvoice.invoiceNumber });
    }
    await transaction.commit();
    return handleSuccess('Order status updated successfully', createNewStatus);
};

exports.cancelOrder = async (id, customerId, remarks) => {
    const orderExist = await commonFunctions.findByPk('order', id, { condition: { customerId } });
    if(!orderExist){
        throw new ValidationError(`Order not found with id ${id} and customer id ${customerId}`)
    }
    const transaction = await sequelize.transaction();

    // delete entry from order status table
    const removeOrder = await commonFunctions.update('orderStatusHistory', 
        { orderId: id }, 
        { 
            status: 'failed',
            ...(remarks ? { remarks } : {} )
        }, 
        true 
    );

    if(removeOrder[0] === 0){
        transaction.rollback();
        throw new InternalServerError('Internal server error');
    }

    // update order details status
    const cancelOrderDetails = await commonFunctions.update("orderDetail", { orderId: id }, { deliveryStatus: 'cancelled' }, true); // return response 
    if(cancelOrderDetails[0] === 0){
        transaction.rollback();
        throw new InternalServerError('Internal server error');
    }
    const orderDetailIds = cancelOrderDetails[1].map((item) => item.id ); // fetch the orderDetails id

    // update order details status
    const cancelDelivery = await commonFunctions.update("orderDeliveryHistory", { 
        orderDetailsId: { 
            [Op.in]: orderDetailIds }, 
            isCurrentActive: true
        }, 
        { isCurrentActive: false }
    );

    let deliveryCancelData = [];
    for(let i=0;i<orderDetailIds.length;i++){
        deliveryCancelData.push({
            orderDetailsId: orderDetailIds[i],
            status: 'cancelled',
            isCurrentActive: true
        });
    }
    await commonFunctions.create("orderDeliveryHistory", deliveryCancelData, isBulk = true);

    if(cancelDelivery[0] === 0){
        transaction.rollback();
        throw new InternalServerError('Internal server error');
    }

    await transaction.commit();
    return handleSuccess('Order cancelled successfully');
};

exports.listOrders = async (query, vendorId) => {
    let page = Number(query.page) || 1;
    let limit = Number(query.limit) || 10;
    let offset = (page - 1) * limit;
    const search = query.search || '';
    // if vendor is logged in it will show vendor products. else it will take vendor id from query which will be optional for filter
    vendorId = vendorId ? vendorId : query.vendorId;
    const report = query.report || false;

    if(report === 'true'){ // skip the limit and offset when admin wants report
        limit = null;
        offset = null;
    }

    const startDate = query.startDate ? new Date(query.startDate) : null;
    const endDate = query.endDate ? new Date(query.endDate) : null;
    const options = {};

    if(startDate && endDate && startDate >= endDate){
        throw new BadRequestError('Start date should be less than End date.')
    }
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.createdAt =  { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        dateFilter.createdAt =  { [Op.gte]: startDate };
    } else if (endDate) {
        dateFilter.createdAt =  { [Op.lte]: endDate };
    }
    

    options.condition = {
        ...(search && {
            [Op.or] : [
                    { orderNumber : { [Op.iLike]: `%${search}%` } },
                ],
            }),
        ...dateFilter
    };

    options.include = [
        {
            model: db.customer,
            as: 'customer',
            attributes: ["id", "firstName", "lastName", "email"]
        },
        {
            model: db.orderStatusHistory,
            as: 'orderStatusHistory',
            attributes: [
                "status", 
                "remarks"
            ],
            include: {
                model: db.user,
                as: 'user',
                attributes: ["id", "firstName", "lastName", "userName"]
            }
        },
    ];
    options.attributes = ["id", "orderNumber", "quantity", "totalAmount", "subTotal", "discount", "paymentStatus", "invoiceNumber", "updatedAt", "createdAt"];
    options.limit = limit;
    options.offset = offset;
    options.subQuery = false;
    options.distinct = true;
    options.order = [["updatedAt", 'desc']]

    const orderRecords = await commonFunctions.findAll('order', options);
    if (!orderRecords.rows || orderRecords.rows.length === 0) {
        throw new NoDataFoundError('No orders found');
    }

    const result = await addVendorDetails(orderRecords);

    // generate excel report of the order
    if(report === 'true'){
        const orderdReport = await createOrdersReport(result.rows);
        return handleSuccess('Orders report generated successfully', orderdReport);
    }
    
    return handleSuccess('Orders fetched successfully', result);
};


exports.getOrderTrackingHistory = async ({ status, page, limit, customerId }) => {
    if(!deliveryEnum[status]){
        throw new BadRequestError('No Status Found');
    }
    const options = {};
    const { pageLimit, offset } = getPagination({ page, limit });
    options['condition'] = { deliveryStatus: deliveryEnum[status] };
    options['include'] = [
        {
            model: db.product,
            as: 'product',
            attributes: [
                "id",
                "name",
                [sequelize.literal(`"product->images->imageDetails"."path"`), 'imagePath']
            ],
            include: [
                {
                    model: db.productImage,
                    as: 'images',
                    attributes: [],
                    include: [
                        {
                            model: db.fileUpload,
                            as: 'imageDetails',
                            attributes: []
                        }
                    ]
                }
            ]
        },
        {
            model: db.order,
            as: 'order',
            attributes: ["id"],
            where : { customerId },
            required: true 
        }
    ];
    options['attributes'] = ["id", "totalPrice", "productQuantity", "deliveryStatus", "createdAt"];
    options['limit'] = pageLimit;
    options['offset'] = offset;
    options['order'] = [["createdAt", 'desc']];

    const result = await commonFunctions.findAll('orderDetail', options);
    if(result.rows.length === 0){
        throw new NoDataFoundError(`No Order Founds Based on ${status}`);
    };
    const formattedOrderResponse = result.rows.map((data) => ({
        orderDetailId: data.id,
        totalPrice: data.totalPrice,
        productQuantity: data.productQuantity,
        deliveryStatus: data.deliveryStatus,
        orderOn: data.createdAt,
        product: data.product,
        orderId: data.order?.id || null
    }));
    const finalResult = {
    page,
    limit,
    totalResponses: result.count,
    totalPages: Math.ceil(result.count / limit),
    responses: formattedOrderResponse,
  };
    return handleSuccess('Orders Fetched Successfully', finalResult);
};

exports.getOrderDetailForMobile = async (id, customerId, orderDetailId, query) => {
    const appConfig = await getAppConfig();
    const options = {};
    options['condition'] = { id, customerId };
    options['include'] = [
        {
            model: db.address,
            as: 'address',
            attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
            }
        },
        {
            model: db.orderDetail,
            as: 'orderDetails',
            where: { id: orderDetailId },
            required: true,
            attributes: [
                "id", "productName", "productPrice", "productQuantity", "productDiscount", "totalPrice",
                [sequelize.literal(`"orderDetails->product->images->imageDetails"."path"`), 'imagePath'],
            ],
            include:[
                {
                    model: db.product,
                    as: 'product',
                    attributes: ['id'],
                    include: [
                        {
                            model: db.productImage,
                            as: 'images',
                            attributes: [],
                            include: [
                                {
                                    model: db.fileUpload,
                                    as: 'imageDetails',
                                    attributes: [],
                                }
                            ]
                        }
                    ]
                },
                {
                    model: db.orderDeliveryHistory,
                    as: 'deliveryHistory',
                    attributes: ["status", "isCurrentActive", "createdAt"],
                }
            ]
        }
    ];
    options['attributes'] = ["orderNumber", "invoiceNumber", "createdAt"];
    const result = await commonFunctions.findOne('order', options);
    if(!result){
        throw new NoDataFoundError('No order Found');
    };
    const orders = result.get({ plain: true});
    if(orders?.orderDetails?.length === 1){
        orders.orderDetails = orders.orderDetails[0];
        orders.orderDetails.productId = orders.orderDetails.product?.id;
        orders.orderDetails.deliveryFee = appConfig.DELIVERY_FEE;
        orders.orderDetails.handlingCharges = appConfig.HANDLING_CHARGES;
        delete orders.orderDetails.product;
    };
    if(query.report === 'true'){
        const reportPath= await createInvoicePDF(orders);
        return handleSuccess('Order details report fetched successfully', reportPath)
    }
    return handleSuccess('Order details fetched successfully', orders);
};

async function handleCancelStatusUpdate(id, status, updatedBy, transaction){
    options = {};
    options.condition = {
        orderDetailsId: id,
        isCurrentActive: true
    }
    options.attributes = ['id', 'status'];
    
    const currentDeliveryStatus = await commonFunctions.findOne('orderDeliveryHistory', options);
    if (!currentDeliveryStatus) {
        await transaction.rollback();
        throw new NoDataFoundError('Order Status not found');
    } 

    // update delivery status in order details
    await commonFunctions.update('orderDetail', { id }, { deliveryStatus: status });

    // update the delivery status in delivery hiostory table
    await commonFunctions.update("orderDeliveryHistory", { id: currentDeliveryStatus.id }, { isCurrentActive: false });

    // add new entry into the delivery status
    const deliveryStatusBody = {
        orderDetailsId: id,
        status,
        updatedBy,
        isCurrentActive: true
    };
    const createNewStatus = await commonFunctions.create('orderDeliveryHistory', deliveryStatusBody, false, transaction);
    if (!createNewStatus) {
        await transaction.rollback();
        throw new InternalServerError('Internal server error');
    }
    return createNewStatus;
}

async function addVendorDetails(orderRecords){
    let result = [];
    const orderArray = orderRecords?.rows;
    for(let i=0;i<orderArray?.length;i++){
        result.push({ ...orderArray[i]?.dataValues });
        result[i].vendorData = [];
        const options = {};
        options.condition = { orderId: result[i]?.id }
        options.include = {
            model: db.vendor,
            as: 'vendor',
            attributes: ["id", "userName", "organizationName"]
        }
        options.attributes = [];
        const orderDetails = await commonFunctions.findAll('orderDetail', options);
        const orderDetailArray = orderDetails?.rows;
        for(let j=0;j<orderDetailArray?.length;j++){
            const orderDetailValues = orderDetailArray[j]?.dataValues;

            result[i].vendorData.push({
                id: orderDetailValues?.vendor?.dataValues?.id,
                userName: orderDetailValues?.vendor?.dataValues?.userName,
                organizationName: orderDetailValues?.vendor?.dataValues?.organizationName,
            })
        }
    }
    return {
        count: orderRecords?.count,
        rows: result
    };
}