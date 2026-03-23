// orderPayment.js

const crypto = require('crypto');
const { BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError');
const handleSuccess = require('../../utils/successHandler');
const db = require('../models');
const commonFunctions = require('../../utils/commonFunctions');

const workingKey = process.env.CCAVENUE_WORKING_KEY;
const merchantId = process.env.CCAVENUE_MERCHANT_ID;
const redirectUrl = process.env.CCAVENUE_REDIRECT_URL;
const accessCode = process.env.CCAVENUE_ACCESS_CODE;

exports.initiatePayment = async (customerId, body) => {
    const { orderId, amount } = body;
    const options = {};
    options.condition = { id: customerId };
    const customerExist = await commonFunctions.findOne('customer', options);
    if(customerExist){
        throw new BadRequestError(`Customer with id ${customerId} not found`);
    }

    const order = await db.order.findByPk(orderId);
    if (!order) {
        throw new BadRequestError('Order not found');
    }

    const data = `merchant_id=${merchantId}&order_id=${orderId}&amount=${amount}&currency=INR&redirect_url=${redirectUrl}`;

    const encryptedData = encrypt(data, workingKey);

    return handleSuccess('Payment initiated', { accessCode, encryptedData });
};


exports.handlePaymentCallback = async (encResponse) => {
    if (!encResponse) {
        throw new ValidationError('Encrypted response is required');
    }

    const decryptedResponse = decrypt(encResponse, workingKey);

    return handleSuccess('Payment callback handled', decryptedResponse);
};


function encrypt(plainText, workingKey) {
    const m = crypto.createCipheriv('aes-128-cbc', workingKey, workingKey.slice(0, 16));
    let encrypted = m.update(plainText, 'utf8', 'hex');
    encrypted += m.final('hex');
    return encrypted;
}

function decrypt(encText, workingKey) {
    const m = crypto.createDecipheriv('aes-128-cbc', workingKey, workingKey.slice(0, 16));
    let decrypted = m.update(encText, 'hex', 'utf8');
    decrypted += m.final('utf8');
    return decrypted;
}


exports.verifyPaymentAndUpdateStatus = async (encResponse) => {
    if (!encResponse) {
        throw new ValidationError('Encrypted response is required');
    }
    const decryptedResponse = decrypt(encResponse, workingKey);
    const parsedResponse = parseResponse(decryptedResponse);

    const {
        order_id: orderId,
        tracking_id: transactionId,
        order_status: orderStatus,
        failure_message: failureMessage,
        payment_mode,
        currency,
        amount
    } = parsedResponse;

    if (!orderId) {
        throw new BadRequestError('Order ID missing in payment response');
    }
    const transaction = await sequelize.transaction();

    try {
        const order = await db.order.findByPk(orderId, { transaction });
        if (!order) {
            throw new BadRequestError('Order not found');
        }

        await db.orderTransaction.create({
            orderId: order.id,
            transactionId: transactionId,
            request: JSON.stringify(encResponse),
            response: JSON.stringify(parsedResponse),
            payment_mode: payment_mode || 'unknown',
            payment_gateway_ref: transactionId,
            status: mapCCAvenueStatus(orderStatus),
        }, { transaction });

        await order.update({
            payment_status: mapCCAvenueStatus(orderStatus)
        }, { transaction });

        if (orderStatus.toLowerCase() === 'success') {
            await db.orderStatusHistory.create({
                orderId: order.id,
                status: 'processed',
                updatedBy: null,
                isCurrentActive: true,
                remarks: 'Payment received, order processing initiated'
            }, { transaction });
        }

        await transaction.commit();
        return handleSuccess('Payment verified and order status updated', parsedResponse);

    } catch (error) {
        await transaction.rollback();
        throw new InternalServerError('Internal server error');
    }
};



function parseResponse(response) {
    const keyValuePairs = response.split('&');
    const parsed = {};
    keyValuePairs.forEach(pair => {
        const [key, value] = pair.split('=');
        parsed[key] = decodeURIComponent(value || '');
    });
    return parsed;
}

function mapCCAvenueStatus(status) {
    switch (status.toLowerCase()) {
        case 'success':
            return 'paid';
        case 'failure':
            return 'failed';
        case 'aborted':
            return 'cancelled';
        case 'pending':
            return 'pending';
        default:
            return 'pending';
    }
}
