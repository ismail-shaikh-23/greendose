const response = require('../../utils/response');
const orderPaymentService = require('../services/payment');

exports.initiatePayment = async (req, res) => {
  const customerId = req.userData.id;
  const result = await orderPaymentService.initiatePayment(customerId, req.body);
  return response.ok(res, result);
};

exports.handlePaymentCallback = async (req, res) => {
  const { encResponse } = req.body;
  const result = await orderPaymentService.handlePaymentCallback(encResponse);
  return response.ok(res, result);
};

exports.verifyPaymentAndUpdateStatus = async (req, res) => {
  const { encResponse } = req.body;
  const result = await orderPaymentService.verifyPaymentAndUpdateStatus(encResponse);
  return response.ok(res, result);
};
