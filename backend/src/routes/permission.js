/* eslint-disable max-len */
const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 

const {
  insertPermission, 
  retrievePermission, 
  retrievePermissionById, 
  modifyPermission, 
  removePermission, 
} = require('../controllers/permission'); 
const checkAuth = require('../middleWare/checkAuth'); 
const permission = require('../middleWare/checkPermission');
const { addPermissionValidator, updatePemissionValidator } = require('../validators/permission');
const { validationHandler } = require('../validators/validationHandler');

router.post('/',checkAuth, addPermissionValidator, validationHandler, errorWrapper(insertPermission)); 
router.get('/', checkAuth, permission, errorWrapper(retrievePermission)); 
router.get('/:id',checkAuth, permission, errorWrapper(retrievePermissionById)); 
router.put('/:id', checkAuth, permission, updatePemissionValidator, validationHandler, errorWrapper(modifyPermission)); 
router.delete('/:id', checkAuth, permission, errorWrapper(removePermission)); 

module.exports = router; 
