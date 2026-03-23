/* eslint-disable max-len */ 
const express = require('express'); 
const router = express.Router(); 
const campaignController = require('../controllers/campaign'); 
const { errorWrapper } = require('../../utils/errorWrapper'); 
const checkAuth = require('../middleWare/checkAuth'); 
const checkPermission = require('../middleWare/checkPermission');
const { validationHandler } = require('../validators/validationHandler');
const checkVendor = require('../middleWare/checkVendor');
const { createFileUpload } = require('../services/fileUpload');
const { validateAddcampaign, validateUpdatecampaign, validateUpdateCampaignStatus } = require('../validators/campaign');

// mobile API's
router.get('/mobile', checkAuth, errorWrapper(campaignController.getCampaignsMobile));
router.get('/mobile/:id', checkAuth, errorWrapper(campaignController.getCampaignsMobileById));

router.get('/', checkAuth, checkPermission, checkVendor, errorWrapper(campaignController.getCampaigns)); 
router.post('/', checkAuth, checkVendor, createFileUpload, validateAddcampaign, validationHandler, errorWrapper(campaignController.addCampaign)); 
router.put('/:id', checkAuth, checkVendor, createFileUpload, validateUpdatecampaign, errorWrapper(campaignController.updateCampaign)); 
router.delete('/:id', checkAuth, checkVendor, errorWrapper(campaignController.deleteCampaign)); 
router.get('/:id', checkAuth, checkVendor, errorWrapper(campaignController.getCampaignById)); 
router.put('/status/:id', checkAuth, checkPermission, validateUpdateCampaignStatus, validationHandler, errorWrapper(campaignController.updateCampaignStatus));

module.exports = router; 
