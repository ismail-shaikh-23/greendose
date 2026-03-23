/* eslint-disable max-len */
const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 

const { 
  insertRolePermission, 
  retrieveRolePermission, 
  retrieveRolePermissionById, 
  modifyRolePermission, 
  removeRolePermission, 
  alterRolePermissions,
} = require('../controllers/rolePermission'); 
const checkAuth = require('../middleWare/checkAuth'); 
const permission = require('../middleWare/checkPermission'); 
const { addRolePermissionValidator, updateRolePermissionValidator } = require('../validators/rolePermission');
const { validationHandler } = require('../validators/validationHandler');

router.post('/', checkAuth, permission, addRolePermissionValidator, validationHandler, errorWrapper(insertRolePermission)); 
router.get('/', checkAuth, permission, errorWrapper(retrieveRolePermission)); 
router.get('/:id', checkAuth, permission, errorWrapper(retrieveRolePermissionById));
router.put('/:id', checkAuth, permission, updateRolePermissionValidator, validationHandler, errorWrapper(modifyRolePermission)); 
router.delete('/:id', checkAuth, permission, errorWrapper(removeRolePermission));

router.post('/bulk-change', checkAuth, errorWrapper(alterRolePermissions));

module.exports = router; 
