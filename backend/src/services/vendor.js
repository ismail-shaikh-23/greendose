/* eslint-disable max-len */
const db = require('../models'); 
const { Op } = require('sequelize');
const { NoDataFoundError, BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const commonFunctions = require('../../utils/commonFunctions');
const { vendorStatus } = require('../../utils/constant');
const sendEmail = require('../../utils/emailService');

exports.createVendor = async(vendorData) => {
  let body = { ...vendorData };

  const options = {};
  options.condition = {
    [Op.or]: [
      { email: vendorData.email },
      { userName: vendorData.userName },
      { mobileNumber: vendorData.mobileNumber }
    ]
  }

  const userExist = await commonFunctions.findOne('user', options);
  if(userExist){
    let validationField;
    let key;
    if(userExist.email === vendorData.email){
      validationField = 'email';
      key = 'email';
    }
    else if(userExist.userName === vendorData.userName){
      validationField = 'username';
      key = 'userName';
    }
    else if(userExist.mobileNumber === vendorData.mobileNumber){
      validationField = 'mobile number';
      key = 'mobileNumber';
    }
    throw new ValidationError(`User with this ${validationField} ${vendorData[key]} already exist`);
  }

  const vendorCreated = await commonFunctions.create('vendor', {...body, status: 'approved' }); // when admin is creating the vendor keep it's default status approved
  if (!vendorCreated) {
    throw new InternalServerError('Internal server error'); 
  }

  // Extract user fields before deleting them from body
  const vendorUserBody = {
    email: vendorData.email,
    userName: vendorData.userName,
    mobileNumber: vendorData.mobileNumber,
    password: vendorData.password || 'password',
    vendorId: vendorCreated.id
  };

  const role = await db.role.findOne({ where: { name: 'vendorUser' } });
  vendorUserBody.roleId = role ? role.id : 2;

  const userCreated = await commonFunctions.create('user', vendorUserBody);
  if(!userCreated){
    throw new InternalServerError('Internal server error'); 
  }

  return handleSuccess('Vendor created');
};

exports.fetchVendorDetails = async(query) => { 
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  let offset = (page - 1) * limit;
  const search = query.search || '';
  const options = {};

  // remove the pagination when allRecords = true
  if(query.allRecords){
    offset = null;
    limit = null;
  }

  let status;
  if (query.status === vendorStatus.PENDING) {
    status = vendorStatus.PENDING;
  } else if (query.status === vendorStatus.REJECTED) {
    status = vendorStatus.REJECTED;
  } else if (query.status === vendorStatus.APPROVED) {
    status = vendorStatus.APPROVED;
  } else if (query.status) {
    status = { [Op.notIn]: [vendorStatus.PENDING, vendorStatus.REJECTED, vendorStatus.APPROVED] };
  }
  
  options.condition = { 
    ...(status && { status }),
    ...(search && {
      [Op.or] : [
        { organizationName : { [Op.iLike]: `%${search}%` } },
      ],
    }),
  };
  options.offset = offset;
  options.limit = limit;

  options.include = [
    {
      model: db.user,
      as: 'users',
      attributes: ['email', 'userName', 'mobileNumber'],
    },
  ];
  const vendorRecords = await commonFunctions.findAll('vendor', options);
  if (vendorRecords.length === 0) { 
    throw new NoDataFoundError();
  } 
  return handleSuccess('Vendor records fetched successfully', vendorRecords); 
}; 

exports.fetchVendorById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const options = {};
  options.condition = { id: id };
  options.include = [
    {
      model: db.user,
      as: 'users',
      attributes: ['email', 'userName', 'mobileNumber'],
    },
  ];
  const vendorDetails = await commonFunctions.findOne('vendor', options); 
  if (!vendorDetails) { 
    throw new NoDataFoundError(`No vendor found with Id ${id}`); 
  } 
  return handleSuccess('Vendor found', vendorDetails); 
}; 

exports.updateVendorById = async( id, updateBody) => { 
  const options = {};
  options.condition = { id: id };
  
  const vendorUpdate = await commonFunctions.update('vendor', { id }, updateBody);
  if (vendorUpdate[0] !== 1) { 
    throw new BadRequestError(`No vendor found with Id ${id}`); 
  } 
  return handleSuccess('Vendor updated successfully');
}; 

exports.deleteVendorById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const removedVendor = await commonFunctions.destroy('vendor', { id });
  if (!removedVendor) { 
    throw new NoDataFoundError(`No vendor found with Id ${id}`); 
  } 
  return handleSuccess('Vendor deleted'); 
}; 

exports.updateVendorStatusById = async( id, updateBody) => { 
  let options = {};
  options.condition = { id: id };
  if(updateBody.status === 'approved'){ // add timestamps when vendor is approved.
    updateBody.approvedDate = new Date();
  }
  const vendorExist = await commonFunctions.findByPk('vendor', id, { condition: { status: 'pending' }});
  if(!vendorExist){
    throw new BadRequestError(`No vendor found with Id ${id}`); 
  }
  const vendorUpdate = await commonFunctions.update('vendor', { id }, updateBody, returning= true);
  await commonFunctions.update('user', { vendorId: id }, { isActive: true });
  if (vendorUpdate[0] !== 1) { 
    throw new InternalServerError(`Internal Setver Error`); 
  } 

  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  let randomPassword = "";
  let length = 8;
  for (let i = 0; i < length; i++) {
    randomPassword += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  options = {};
  options.condition = {
    [Op.or]: [
      { email: vendorExist.email },
      { userName: vendorExist.userName },
      { mobileNumber: vendorExist.mobileNumber }
    ]
  }
  const userExist = await commonFunctions.findOne('user', options);
  if(userExist){
    let validationField;
    let key;
    if(userExist.email === vendorExist.email){
      validationField = 'email';
      key = 'email';
    }
    else if(userExist.userName === vendorExist.userName){
      validationField = 'username';
      key = 'userName';
    }
    else if(userExist.mobileNumber === vendorExist.mobileNumber){
      validationField = 'mobile number';
      key = 'mobileNumber';
    }
    throw new ValidationError(`User with this ${validationField} ${vendorExist[key]} already exist`);
  }

  if(updateBody.status === 'approved'){
    const vendorUserBody = {
      email: vendorExist.email,
      userName: vendorExist.userName,
      mobileNumber: vendorExist.mobileNumber,
      password: randomPassword,
      vendorId: vendorExist.id
    };

    const role = await db.role.findOne({ where: { name: 'vendorUser' } });
    vendorUserBody.roleId = role ? role.id : 2;

    const userCreated = await commonFunctions.create('user', vendorUserBody);
    if(!userCreated){
      throw new InternalServerError('Internal server error'); 
    }

    // send email to the vendor
    const mailTemplate = await commonFunctions.findOne('mailTemplate', { condition: { event: 'vendor-approve' }});
    const subject = mailTemplate.subjectLine;
    let mailBody = mailTemplate.content;
    mailBody = mailBody.replaceAll("{{baseUrl}}", process.env.FRONT_END_BASE_URL ||  "http://localhost:3000");
    mailBody = mailBody.replace("{{password}}", randomPassword);

    await sendEmail(vendorExist.email, subject, mailBody);
  }
  return handleSuccess('Vendor Status updated successfully');
}; 

exports.registerVendor = async(vendorData) => {
  let body = { ...vendorData };

  const options = {};
  options.condition = {
    [Op.or]: [
      { email: vendorData.email },
      { userName: vendorData.userName },
      { mobileNumber: vendorData.mobileNumber }
    ]
  }

  const userExist = await commonFunctions.findOne('user', options);
  if(userExist){
    let validationField;
    let key;
    if(userExist.email === vendorData.email){
      validationField = 'email';
      key = 'email';
    }
    else if(userExist.userName === vendorData.userName){
      validationField = 'username';
      key = 'userName';
    }
    else if(userExist.mobileNumber === vendorData.mobileNumber){
      validationField = 'mobile number';
      key = 'mobileNumber';
    }
    throw new ValidationError(`User with this ${validationField} ${vendorData[key]} already exist. Please add different ${validationField}.`);
  }

  const vendorCreated = await commonFunctions.create('vendor', body); // status is pending by default.
  if (!vendorCreated) {
    throw new InternalServerError('Internal server error'); 
  }

  return handleSuccess('Vendor registerd successfully');
};

exports.sendEmailToUnregisteredVendor = async(email) => {
  const mailTemplate = await commonFunctions.findOne('mailTemplate', { condition: { event:'vendorRegisterEmail' } });
  if(!mailTemplate){
    throw new NoDataFoundError('No Mail Template Found for Vendor Registration');
  }
  mailTemplate.content = mailTemplate.content.replace("<%%>",`${process.env.FRONT_END_BASE_URL}registration`);
  sendEmail(email,mailTemplate.subjectLine,mailTemplate.content);
  return handleSuccess('Mail sent Successfully to the vendor');
};