/* eslint-disable max-len */
const response = require('../../utils/response');
const { createAddress, fetchAddressDetails, fetchAddressById, updateAddressById, deleteAddressById, fetchAddressByCustomer } = require('../services/address');

exports.insertAddress = async(req, res) => {
  const userId = req.userData.id;
  const result = await createAddress(userId, req.body);
  return response.ok(res, result);
};

exports.getAddresses = async(req, res) => {
  const result = await fetchAddressDetails(req.query);
  return response.ok(res, result);
};

exports.getAddressById = async(req, res ) => {
  const { id } = req.params;
  const result = await fetchAddressById(id);
  return response.ok(res, result);
};

exports.getAddressByCustomer = async(req, res) => {
  const result = await fetchAddressByCustomer(req.userData.id);
  return response.ok(res, result);
};

exports.modifyAddress = async(req, res ) => {
  const { id } = req.params;
  const result = await updateAddressById(id, req.body);
  return response.ok(res, result);
};

exports.removeAddress = async(req, res ) => {
  const { id } = req.params;
  const result = await deleteAddressById(id);
  return response.ok(res, result);
};
