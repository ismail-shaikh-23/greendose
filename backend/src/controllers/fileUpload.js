const { createFileUpload, getFileDetails, 
  getFileDetailsById, deleteFileData, 
  updateFileDetails } = require('../services/fileUpload'); 
const response = require('../../utils/response'); 

exports.uploadFile = async(req, res) => { 
  const result = await createFileUpload(req, res); 
  return response.created(res, result); 
}; 

exports.getFileDetails = async(req, res) => { 
  const result = await getFileDetails(); 
  return response.created(res, result); 
}; 

exports.getFileDetailsById = async(req, res) => { 
  const { id } = req.params; 
  const result = await getFileDetailsById(id); 
  return response.created(res, result); 
}; 

exports.updateFileDetails = async(req, res) => { 
  const { id } = req.params; 
  const result = await updateFileDetails(id, req, res); 
  return response.created(res, result); 
}; 

exports.deleteFile = async(req, res) => { 
  const { id } = req.params; 
  const result = await deleteFileData(id); 
  return response.created(res, result); 
}; 
