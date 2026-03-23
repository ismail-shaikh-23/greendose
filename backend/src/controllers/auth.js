/* eslint-disable max-len */
const { commonLogin, commonLogOut, generateNewOtp, forgotPassword, verifyOtp, resetPassword, setNewPassword } = require('../services/auth'); 
const response = require('../../utils/response'); 

exports.login = async(req, res) => { 
  const { isCustomer } = req.query;
  const { identifier, password, otp } = req.body; 
  const loggedInUser = await commonLogin(identifier, password, otp, isCustomer); 
  return response.ok(res, loggedInUser); 
}; 

exports.logout = async(req, res) => { 
  const { isCustomer } = req.query;
  const loggedOutUser = await commonLogOut(req.userData.id, isCustomer); 
  return response.ok(res, loggedOutUser); 
}; 

exports.generateOtp = async(req, res) => { 
  const { mobileNumber } = req.body;
  const generatedOtp = await generateNewOtp({ mobileNumber }); 
  return response.ok(res, generatedOtp); 
}; 

exports.forgotPassword = async(req, res) => {
  const result = await forgotPassword(req.body);
  return response.ok(res, result);
};

exports.verifyOtp = async(req, res) => {
  const result = await verifyOtp(req.body);
  return response.ok(res, result);
};

exports.resetPassword = async(req, res) => {
  const result = await resetPassword(req.body);
  return response.ok(res, result);
};

exports.setNewPassword = async(req, res) => {
  const result = await setNewPassword(req.params.id, req.body, req.userData);
  return response.ok(res, result);
};