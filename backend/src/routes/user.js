/* eslint-disable max-len */
const router = require('express').Router();
const { errorWrapper } = require('../../utils/errorWrapper');

const {
  insertUser,
  retrieveUser,
  retrieveUserById,
  modifyUser,
  removeUser,
} = require('../controllers/user');
const checkAuth = require('../middleWare/checkAuth'); 
const permission = require('../middleWare/checkPermission');
const { validateAddUser, validateUpdateUser } = require('../validators/user');
const { validationHandler } = require('../validators/validationHandler');
 
router.post('/', validateAddUser, validationHandler, errorWrapper(insertUser));
router.get('/', checkAuth, permission, errorWrapper(retrieveUser));
router.get('/:id', checkAuth, permission, errorWrapper(retrieveUserById));
router.put('/:id', checkAuth, permission, validateUpdateUser, validationHandler, errorWrapper(modifyUser));
router.delete('/:id', checkAuth, permission, errorWrapper(removeUser));

module.exports = router;
