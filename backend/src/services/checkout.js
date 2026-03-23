// checkoutService.js

const db = require('../models');
const { BadRequestError, ValidationError, NoDataFoundError } = require('../../utils/customError');
const handleSuccess = require('../../utils/successHandler');
const commonFunctions = require('../../utils/commonFunctions');
const { sequelize } = db;

exports.checkoutCart = async (customerId) => {
    if (!customerId) {
        throw new ValidationError('Customer ID is required');
    }

    const cart = await db.cart.findOne({
        where: { customerId, isActive: true },
        include: [{ model: db.cartItem, as: 'cartItems' }]
    });

    if (!cart) {
        throw new NoDataFoundError('No active cart found for checkout');
    }

    if (!cart.cartItems || cart.cartItems.length === 0) {
        throw new BadRequestError('Cart is empty');
    }

    const transaction = await sequelize.transaction();

    try {
        const subtotal = cart.subtotal;
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        const order = await commonFunctions.create(db.order, {
            customerId,
            cartId: cart.id,
            subtotal,
            tax,
            totalAmount: total,
            paymentStatus: 'pending'
        }, transaction);

        const orderItems = cart.cartItems.map(item => ({
            orderId: order.id,
            productId: item.productId,
            productName: 'Product Name', // Ideally fetched from product table
            productDescription: 'Description', // Optional
            productPrice: item.unitPrice,
            productQuantity: item.quantity,
            productDiscount: item.discount,
            totalPrice: item.totalPrice
        }));

        await db.orderDetail.bulkCreate(orderItems, { transaction });

        await db.cart.update({ isActive: false }, { where: { id: cart.id }, transaction });

        await transaction.commit();
        return handleSuccess('Checkout completed successfully', { orderId: order.id });
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};