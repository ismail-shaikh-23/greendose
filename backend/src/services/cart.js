// cart.js

const db = require('../models');
const { Op } = require('sequelize');
const { NoDataFoundError, BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError');
const handleSuccess = require('../../utils/successHandler');
const commonFunctions = require('../../utils/commonFunctions');
const {errorWrapper} = require('../../utils/errorWrapper');
const { formattedProductResponse, formattedRawProductResponse } = require('../../utils/helperFunctions/formattedProduct');
const { getAppConfig } = require('../../utils/redisConstants');

exports.createCart = async (customerId, cartData) => {
    const cartCreated = await commonFunctions.create('cart', { customerId, ...cartData });
    if (!cartCreated) {
        throw new InternalServerError('Internal server error');
    }
    return handleSuccess('Cart created');
};

exports.fetchCartByCustomerId = async (customerId) => {
    const checkCustomer = await commonFunctions.findByPk('customer', customerId);
    if(!checkCustomer){
        throw new ValidationError('Coustomer not found')
    }
    const options = {};
    options.condition = { customerId, isActive: true };
    options.attributes = ['id', 'customerId', 'subTotal', 'total','handlingCharges','deliveryFee'];
    options.include = [
        { 
            model: db.cartItem, 
            as: 'cartItems', 
            attributes: ['id', 'unitPrice', 'discount', 'totalPrice', 'quantity', 'productId'],
            include: [
                {
                    model: db.product,
                    as: 'product',
                    include: [
                        {
                            model: db.productImage,
                            as: 'images',
                            attributes: ['id'],
                            include:[
                                {
                                    model: db.fileUpload,
                                    as: 'imageDetails',
                                    attributes: ['path']
                                }
                            ]
                        },
                      {
                        model: db.offerProduct,
                        as: 'offerProducts',
                        attributes: ['id', 'priority'],
                        where: { status: 'active' },
                        required: false,
                        include: {
                        model: db.offer,
                        as: 'offer',
                        where: { status: 'active' },
                        required:false,
                        attributes: ['name', 'type', 'discountType', 'discountValue', 'status'],
                        },
                    },
                    ]
                }
            ]
        }
    ]

    const cartDetails = await commonFunctions.findOne('cart', options);
    if (!cartDetails) {
        throw new NoDataFoundError(`No cart found for customer ID ${customerId}`);
    }
    const cartItems = cartDetails.cartItems.map((data)=> {
        if(data.quantity <= 0){
            return null;
        }
       return {
         id: data.id,
         unitPrice: data.unitPrice,
         discount: data.discount,
         totalPrice: data.totalPrice,
         quantity: data.quantity,
         product: formattedRawProductResponse(data.product),
       }; 
       
    }).filter(Boolean);
    const cartTotal = {
        id: cartDetails.id,
        customerId: cartDetails.customerId,
        subTotal: cartDetails.subTotal,
        total: cartDetails.total,
        handlingCharges: cartDetails.handlingCharges,
        deliveryFee: cartDetails.deliveryFee
    };
    cartTotal['cartItems'] = cartItems;
    return handleSuccess('Cart found', cartTotal);
};

exports.manageProductsOfCart = async (customerId, items) => {
    const appSetting = await getAppConfig();
    const checkCustomer = await commonFunctions.findByPk('customer', customerId);
    if(!checkCustomer){
        throw new ValidationError('Coustomer not found')
    }
    let options = {};
    options.condition = {
        customerId, 
        isActive: true,
    }
    let cartDetails = await commonFunctions.findOne('cart', options);
    if (!cartDetails) {
        const cartData = {
            customerId,
            subTotal: 0,
            total: 0,
            discount: 0
        }
        cartDetails = await commonFunctions.create('cart', cartData);
    }

    options.attributes = ['id', 'price'];
    const cartItems = [];

    for(let i=0;i<items.length;i++){
        options.condition = { 
            id: items[i].productId,
            quantity: {
                [Op.gte]: items[i].quantity
            }
        };
        const isAdd = items[i].isAdd;
        options.include = [
            {
                model: db.offerProduct,
                as: 'productDiscount',
                where: {
                    status: 'active',
                    deletedAt: null
                },
                required: false,
                include: [
                    {
                        model: db.offer,
                        as: 'offer',
                        status: 'active',
                        attributes: ['discountType', 'discountValue']
                    }
                ],
                attributes: ['id']
            },
            {
                model: db.subCategory,
                as: 'subCategory',
                include: [
                    {
                        model: db.category,
                        as: 'category',
                        attributes: ['name']
                    }
                ],
                attributes: ['id']
            }
        ];
        const product = await commonFunctions.findOne('product', options);
        if(!product){
            throw new BadRequestError(`Product not found with id ${items[i].productId} and quantity ${items[i].quantity}`)
        };
        const cartItemsoptions = {};
        cartItemsoptions['condition'] = { cartId: cartDetails.id,productId: items[i].productId };
        const checkIfExistProductInCartItems = await commonFunctions.findOne('cartItem', cartItemsoptions);
        if(checkIfExistProductInCartItems && checkIfExistProductInCartItems.quantity === 0){
            await commonFunctions.destroy('cartItem', { id: checkIfExistProductInCartItems.id });
            continue;
        }
        if(checkIfExistProductInCartItems && isAdd){
            const updatedQuantity = (items[i].quantity | 1) + checkIfExistProductInCartItems.quantity;
            const updatedPrice =  Number((product.price * updatedQuantity));
            const productDiscount = await calculateDiscount(product);
            const totalDiscount = Number(productDiscount * updatedQuantity);
            const totalPrice = Number(updatedPrice - totalDiscount);
            const updatedBody = { 
                quantity: updatedQuantity,
                unitPrice: updatedPrice.toFixed(2),
                discount: totalDiscount.toFixed(2),
                totalPrice: totalPrice.toFixed(2) > 0 ? totalPrice.toFixed(2) : 0,
            };

            await commonFunctions.update('cartItem', { id: checkIfExistProductInCartItems.id } , updatedBody);
        }else if (checkIfExistProductInCartItems && !isAdd){
            const updatedQuantity = checkIfExistProductInCartItems.quantity - (items[i].quantity | 1);
            if(updatedQuantity === 0){
                await commonFunctions.destroy('cartItem', { id: checkIfExistProductInCartItems.id });
                continue;
            }
            const updatedPrice =  Number((product.price * updatedQuantity));
            const productDiscount = await calculateDiscount(product);
            const totalDiscount = Number(productDiscount * updatedQuantity);
            const totalPrice = Number(updatedPrice - totalDiscount);
            const updatedBody = { 
                quantity: updatedQuantity,
                unitPrice: updatedPrice.toFixed(2),
                discount: totalDiscount.toFixed(2),
                totalPrice: totalPrice.toFixed(2) > 0 ? totalPrice.toFixed(2) : 0,
            };

            await commonFunctions.update('cartItem', { id: checkIfExistProductInCartItems.id } , updatedBody);
        }else{
            const productDiscount = await calculateDiscount(product);
            const totalDiscount = (items[i].quantity | 1) * productDiscount;
            const totalPrice = ( product.price * (items[i].quantity | 1) ) - ( totalDiscount | 0) ;
            cartItems.push({
                productId: items[i].productId,
                cartId: cartDetails.id,
                unitPrice: product.price * (items[i].quantity | 1),
                quantity: items[i].quantity | 1,
                discount: totalDiscount | 0,
                totalPrice: totalPrice > 0 ? totalPrice : 0
            });
        }
       
    }
    await commonFunctions.create('cartItem', cartItems, isBulk= true);


    const cartSubTotal = await commonFunctions.sum('cartItem', 'unitPrice', { condition: { 
        cartId: cartDetails.id,
        deletedAt: null
    } });
    const cartTotal = await commonFunctions.sum('cartItem', 'totalPrice', { condition: { 
        cartId: cartDetails.id,
        deletedAt: null
    } })
    const cartDiscount = await commonFunctions.sum('cartItem', 'discount', { condition: { 
        cartId: cartDetails.id,
        deletedAt: null
    } });
  
    await cartDetails.update({
        subTotal: cartSubTotal,
        total: cartTotal,
        discount: cartDiscount,
        deliveryFee: appSetting.DELIVERY_FEE,
        handlingCharges: appSetting.HANDLING_CHARGES,
    });
    return handleSuccess('Products added to cart successfully');
};

exports.clearCart = async (customerId) => {
    const options = {};
    options.condition = { customerId, isActive: true };
    const cart = await commonFunctions.findOne('cart', options);
    if (!cart) {
        throw new NoDataFoundError('No active cart found');
    }

    await commonFunctions.destroy('cartItem', { cartId: cart.id });
    await cart.update({ subTotal: 0, total: 0 });

    return handleSuccess('Cart cleared successfully');
};

exports.getCartItemCount = async (customerId) => {
    const options = {};
    options.condition = { customerId, isActive: true };
    const cart = await commonFunctions.findOne('cart', options);
    if (!cart) {
        throw new NoDataFoundError('No active cart found');
    }

    const itemCount = await db.cartItem.sum('quantity', {
        where: { cartId: cart.id },
    });
    return handleSuccess('Cart item count fetched', { itemCount });
};


exports.updateCartItemQuantity = async (updateData) => {
    const { customerId, productId, cartItemId, newQuantity, newDiscount } = updateData; 
    const cartDetails = await commonFunctions.findOne('cart', { condition: { customerId, isActive: true } });
    if (!cartDetails) {
        throw new NoDataFoundError(`No carts found for customer with id ${customerId}`);
    }
    
    const cartItem = await commonFunctions.findOne('cartItem', { condition: { id: cartItemId, productId, cartId: cartDetails.id }});
    if (!cartItem) {
        throw new NoDataFoundError(`No cart item found with id ${cartItemId} and product id ${productId}`);
    }

    const options = {};
    options.condition = { 
            id: productId,
            quantity: {
                [Op.gte]: newQuantity
            }
        };

    const productDetails = await commonFunctions.findOne('product', options);
    if(!productDetails){
        throw new BadRequestError(`Product not found with id ${productId} and quantity ${newQuantity}`);
    };

    const updatedTotalPrice = (productDetails.price * newQuantity) - newDiscount | 0;
    await cartItem.update({
        quantity: newQuantity,
        discount: newDiscount | 0,
        totalPrice: updatedTotalPrice
    });

    const cartTotal = await commonFunctions.sum('cartItem', 'totalPrice', { condition: { cartId: cartDetails.id } });
    const cartDiscount = await commonFunctions.sum('cartItem', 'discount', { condition: { cartId: cartDetails.id } });

    await cartDetails.update({
        subtotal: cartTotal,
        total: cartDiscount
    });
    return handleSuccess('Cart item updated successfully');
};


exports.removeCartItem = async (customerId, productId) => {
    const cartDetails = await commonFunctions.findOne('cart', { condition: { customerId, isActive: true } });
    if (!cartDetails) {
        throw new NoDataFoundError('No active cart found');
    }

    const deletedItem = await commonFunctions.destroy('cartItem', { cartId: cartDetails.id, productId });
    if (!deletedItem) {
        throw new NoDataFoundError('Product not found in cart');
    }

    const cartTotal = await commonFunctions.sum('cartItem', 'totalPrice', { condition: { cartId: cartDetails.id } });
    const cartDiscount = await commonFunctions.sum('cartItem', 'discount', { condition: { cartId: cartDetails.id } });

    await cartDetails.update({
        subTotal: cartTotal,
        total: cartTotal - cartDiscount
    });

    return handleSuccess('Product removed from cart successfully');
};

async function calculateDiscount(product){
    const productPrice = product.price;
    let productDiscountValue = 0;
    let categoryDiscountValue = 0;
    const poductDiscount = product.productDiscount[0]?.offer;
    const categoryName = product.subCategory?.category?.name;
    const fixedDiscount = await commonFunctions.findOne('appSetting', { condition: { key: 'fixedDiscountCategories' }});
    
    // find if product category have any discount
    if(fixedDiscount){
        const fixedDiscountArray = JSON.parse(fixedDiscount.value);
        for(let i=0;i<fixedDiscountArray?.length;i++){
            if(fixedDiscountArray[i]?.key === categoryName){
                categoryDiscountValue = (productPrice * fixedDiscountArray[i]?.value ) / 100;
            }
        }
    }

    // find if product induvidually have any discount
    if(poductDiscount){
        const discountType = poductDiscount.discountType;
        const discountValue = poductDiscount.discountValue;

        if(discountType === 'flat'){
            productDiscountValue = (productPrice - discountValue) > 0 ? productPrice - discountValue : 0;
        }
        else if(discountType === 'percentage'){
            productDiscountValue = (productPrice * discountValue) / 100;
        }
    }

    // return maximum  discount value
    return categoryDiscountValue > productDiscountValue ? categoryDiscountValue : productDiscountValue;
}
