/* eslint-disable max-len */ 
const db = require('../models'); 
const multer = require('multer'); 
const fs = require('fs'); 
const path = require('path'); 
const { 
  NoDataFoundError, 
  BadRequestError, 
} = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const response = require('../../utils/response');

let folderPath = path.join('public', 'uploads'); 
if (!fs.existsSync(folderPath)) { 
  fs.mkdirSync(folderPath); 
} 
const storage = multer.diskStorage({ 
  destination: function(req, file, cb) { 
    cb(null, folderPath); 
  }, 
  filename: function(req, file, cb) { 
    const extArray = file.originalname.split('.'); 
    const extension = extArray[extArray.length - 1]; 
    cb(null, `${Date.now()}.${extension}`); 
  }, 
}); 

exports.createFileUpload = async(req, res, next) => { 
  return new Promise(async (resolve, reject) => { 
    const uploadFiles = multer({ 
      storage: storage,
      limits: { fileSize: 2 * 1024 * 1024 }, // max 2 MB,
      fileFilter(req, file, cb){
        checkFileType(file, cb);
      }
    }).single('files'); 
    uploadFiles(req, res, async function(err) { 
      if (err) { 
        return response.badRequest(res, {message: err.message}); 
      } 
      const { userId } = req.body;
      const creator = userId ? userId : req.userData.id; 
        if(req.file === undefined){ // in case of update api without image update
          req.uploadedFiles = null;
          return next();
        }
      const { path, mimetype } = req.file; 
      const extArray = req.file.originalname.split('.'); 
      const extension = extArray[extArray.length - 1]; 
      const filePath = path.replace('public', '');
      const filesData = { 
        userId: creator, 
        path: filePath.replace(/\\/g, '/'),
        mimeType: mimetype, 
        extension 
      }; 
      const files = await db.fileUpload.create(filesData);
      req.uploadedFiles = files.id;
      resolve(handleSuccess('Files uploaded', files));
      next();
    }); 
  }); 
}; 

exports.createMultipleUpload = async(req, res, next) => {
  return new Promise((resolve, reject) => {
    const uploadFiles = multer({ 
      storage: storage,
      limits: { fileSize: 2 * 1024 * 1024 }, // max 2 MB,
      fileFilter(req, file, cb){
        checkFileType(file, cb);
      }
    }).any();
    uploadFiles(req, res, async function(err) {
      if (err) {
        return response.badRequest(res, {message: err.message});
      }
      if(!req.files){
        req.uploadedFiles = null;
        return next();
      }
      const { userId } = req.body;
      const creator = userId ? userId : req.userData.id;
      const files = req.files;
      try {
        const filesData = files.map(file => {
          const extArray = file.originalname.split('.');
          const extension = extArray[extArray.length - 1];
          const filePath = file.path.replace('public', '');
          return {
            userId: creator,
            path: filePath.replace(/\\/g, '/'),
            mimeType: file.mimetype,
            extension: extension,
          };
        });

        const uploadedFiles = await db.fileUpload.bulkCreate(filesData, { returning: true });
        req.uploadedFiles = uploadedFiles.map(file => file.id);
        resolve(handleSuccess('Files uploaded', uploadedFiles));
        next();
      } catch (err) {
        return response.badRequest(res, {error: err.message});
      }
    });
  })
};

exports.getFileDetails = async() => { 
  const response = await db.fileUpload.findAll({ where: { deletedAt: null } }); 
  if (response && response.length) { 
    return handleSuccess('File details found', response); 
  } else { 
    throw new NoDataFoundError('No file details found'); 
  } 
}; 

exports.getFileDetailsById = async(id) => { 
  const response = await db.fileUpload.findOne({ where: { id, deletedAt: null } }); 
  if (response) { 
    return handleSuccess('File details found', response); 
  } else { 
    throw new NoDataFoundError(`No file details found with given id ${id}`); 
  } 
}; 

exports.updateFileDetails = async(id, req, res) => { 
  return new Promise((resolve, reject) => { 
    const uploadFiles = multer({ storage: storage }).single('file'); 
    uploadFiles(req, res, function(err) { 
      if (err) { 
        reject(new BadRequestError(err.message)); 
      } 
      const { user_id } = req.body; 
      const { path, mimetype } = req.file; 
      const extArray = req.file.originalname.split('.'); 
      const extension = extArray[extArray.length - 1]; 
      const data = { user_id: user_id, path: path, mime_type: mimetype, extension }; 
      db.fileUpload.update(data, { where: { id } }).then((data) => { 
        resolve(handleSuccess('File Data updated',data)); 
      }).catch((err) => { 
        reject(new BadRequestError('File data not updated',err)); 
      }); 
    }); 
  }); 
}; 

exports.deleteFileData = async(id) => { 
  const response = await db.fileUpload.destroy({ where: { id } }); 
  if (response) { 
    return handleSuccess('File details deleted', response); 
  } else { 
    throw new NoDataFoundError('File details not deleted'); 
  } 
}; 

function checkFileType(file, cb) {
  const allowedFileTypes = [
    ".png",
    ".jpg",
    ".jpeg",
    ".svg",
  ];
  // Check if the file extension is in the allowed file types
  const fileExtension = `.${file.originalname.split(".").pop()}`;
  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
}

