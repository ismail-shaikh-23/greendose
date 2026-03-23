const response = require('../../utils/response');
const orderService = require('../services/order');

exports.insertOrder = async (req, res) => {
  const customerId = req.userData.id;
  const addressId = req.body.addressId;
  const result = await orderService.createOrder(customerId, addressId);
  if(result.fault){
    return res.status(200).json(result);
  }
  return response.created(res, result);
};

exports.getOrderById = async (req, res) => {
  const id = req.params.id;
  const vendorId = req.vendor?.vendorId;
  const result = await orderService.getOrderWithDetailsById(id, vendorId);
  return response.ok(res, result);
};

exports.updateOrderStatus = async (req, res) => {
  const id = req.params.id; 
  const body = req.body;
  const result = await orderService.updateOrderStatus(id, body);
  return response.ok(res, result);
};

exports.updatePaymentStatus = async (req, res) => {
  const id = req.params.id; 
  const body = req.body;
  const result = await orderService.modifyPaymentStatus(id, body);
  return response.ok(res, result);
};

exports.updateDeliveryStatus = async (req, res) => {
  const id = req.params.id; 
  const body = req.body;
  body.updatedBy = req.userData.id;
  const vendorId = req.vendor?.vendorId;
  const result = await orderService.modifyDeliveryStatus(id, vendorId, body);
  return response.ok(res, result);
};

exports.getDeliveryStatus = async (req, res) => {
  const id = req.params.id;
  const result = await orderService.fetchDeliveryStatus(id);
  return response.ok(res, result);
};



exports.cancelOrder = async (req, res) => {
  const { remarks } = req.body;
  const id = req.params.id;
  const customerId = req.userData.id; 
  const result = await orderService.cancelOrder(id, customerId, remarks);
  return response.ok(res, result);
};

exports.listOrders = async (req, res) => {
  const vendorId = req.vendor?.vendorId;
  const result = await orderService.listOrders(req.query, vendorId);
  return response.ok(res, result);
};

exports.getOrderTrackingHistory = async (req, res) => {
  const result = await orderService.getOrderTrackingHistory({ status: req.query.status, page: req.query.page, limit: req.query.limit, customerId: req.userData.id });
  return response.ok(res, result);
};

exports.getOrderDetailForMobile = async (req, res) => {
  const result = await orderService.getOrderDetailForMobile(req.params.id,req.userData.id,req.params.orderDetailId,req.query);
  return response.ok(res, result);
};