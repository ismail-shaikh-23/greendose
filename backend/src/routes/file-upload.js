const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 

const { 
  uploadFile, getFileDetails, getFileDetailsById, 
  updateFileDetails, deleteFile, 
} = require('../controllers/fileUpload'); 
 
router.post('/', errorWrapper(uploadFile)); 
router.get('/', errorWrapper(getFileDetails)); 
router.get('/:id', errorWrapper(getFileDetailsById)); 
router.put('/:id', errorWrapper(updateFileDetails)); 
router.delete('/:id', errorWrapper(deleteFile)); 

module.exports = router; 
