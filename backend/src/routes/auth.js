/* eslint-disable max-len */
const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 
const checkAuth = require('../middleWare/checkAuth'); 
const { 
  login, 
  logout, 
  generateOtp,
  forgotPassword,
  verifyOtp,
  resetPassword,
  setNewPassword,
} = require('../controllers/auth'); 
const { loginAuthValidator } = require('../validators/auth');
const { validationHandler } = require('../validators/validationHandler');
 
router.post('/login', loginAuthValidator, validationHandler, errorWrapper(login)); 
router.post('/logout', checkAuth, errorWrapper(logout)); 
router.post('/generate-otp', errorWrapper(generateOtp)); 

router.post('/forgot-password', errorWrapper(forgotPassword));
router.post('/verify-otp', errorWrapper(verifyOtp));
router.post('/reset-password', errorWrapper(resetPassword));
router.put('/update-password/:id' ,checkAuth, errorWrapper(setNewPassword));

module.exports = router; 
