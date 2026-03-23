/* eslint-disable max-len */
const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 

const { 
  insertRole, 
  retrieveRole, 
  retrieveRoleById, 
  modifyRole, 
  removeRole, 
} = require('../controllers/role'); 
const checkAuth = require('../middleWare/checkAuth'); 
const permission = require('../middleWare/checkPermission'); 
const { addRoleValidator, updateRoleValidator } = require('../validators/role');
const { validationHandler } = require('../validators/validationHandler');
 
 
router.post('/', checkAuth, permission, addRoleValidator, validationHandler, errorWrapper(insertRole));
router.get('/', checkAuth, permission, errorWrapper(retrieveRole)); 
router.get('/:id', checkAuth, permission, errorWrapper(retrieveRoleById)); 
router.put('/:id', checkAuth, permission, updateRoleValidator, validationHandler, errorWrapper(modifyRole)); 
router.delete('/:id', checkAuth, permission, errorWrapper(removeRole)); 

module.exports = router; 
