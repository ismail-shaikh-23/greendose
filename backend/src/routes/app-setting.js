/* eslint-disable max-len */ 
const express = require('express'); 

const router = express.Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 
const { updateLogo } = require('../controllers/appSetting');
 
router.post('/update-logo', errorWrapper(updateLogo)); 


module.exports = router; 
