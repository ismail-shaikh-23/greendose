 
/* eslint-disable max-len */
const jwt = require('jsonwebtoken');
const db = require('../models');
const {
  NoDataFoundError,
  BadRequestError,
  ValidationError,
  ForbiddenError,
  InternalServerError,
} = require('../../utils/customError');
const handleSuccess = require('../../utils/successHandler');
const { role, JWT_SECRET } = require('../../utils/constant');
const commonFunctions = require('../../utils/commonFunctions');
const { Op } = require('sequelize');
const { getAppConfig } = require('../../utils/redisConstants');
const redisClient = require('../../utils/redis');
const sendEmail = require('../../utils/emailService');
const { 
  forgotPassword, resetPassword, 
  setNewPassword, forgotPasswordSubject, 
  resetPasswordSubject, setNewPasswordSubject,
} = require('../../utils/emailTemplates');
const bcrypt = require('bcrypt');
const { encrypt } = require('../../utils/crypto');

const createToken = (id, userName, roleId) => {
  const payload = { id, userName, roleId };
  const encryptedPayload = encrypt(JSON.stringify(payload));

  const token = jwt.sign({ data: encryptedPayload }, process.env.JWT_SECRET || JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN || '24h',
  });
  return token;
};


async function saveTokenInDBAndCache(userType, userId, token, userData) {
  const tokenTable = userType === 'customer' ? 'customerToken' : 'userToken';
  const tokenKey = `${userType}Token_${token}`;
  const userKey = `${userType}_${userId}`;

  let tokenOptions = { condition: { userId: userId } };
  if (userType === 'customer') {
    tokenOptions = { condition: { customerId: userId } };
  }
  const existingToken = await commonFunctions.findOne(tokenTable, tokenOptions);

  if (userType === 'customer') {
    if (existingToken) {
      await commonFunctions.update(tokenTable, { customerId: userId }, { token });
    } else {
      await commonFunctions.create(tokenTable, { customerId: userId, token });
    }
  } else {
    if (existingToken) {
      await commonFunctions.update(tokenTable, { userId }, { token });
    } else {
      await commonFunctions.create(tokenTable, { userId, token });
    }
  }

  await redisClient.set(tokenKey, token, { EX: 86400 });
  await redisClient.set(userKey, JSON.stringify(userData), { EX: 86400 });
}

async function validateCustomerStatusAndBlocking(commonDetails, loginAttempt, appConstants) {
  if (!commonDetails.isActive) {
    const isBlockExpired = loginAttempt?.blockedUntil && new Date() > loginAttempt.blockedUntil;
    if (isBlockExpired) {
      await commonFunctions.update('customer', { id: commonDetails.id }, { isActive: true });
      await commonFunctions.update('loginAttempt', { customerId: commonDetails.id }, {
        totalAttempts: 0,
        blockedUntil: null,
      });
      commonDetails.isActive = true;
    } else {
      throw new ForbiddenError('Customer is currently blocked');
    }
  }

  if (appConstants && appConstants.BLOCKING_MODE) {
    if (loginAttempt?.totalAttempts >= appConstants.MAX_ATTEMPT) {
      await commonFunctions.update('customer', { id: commonDetails.id }, { isActive: false });
      throw new ForbiddenError('Customer is blocked due to multiple failed attempts');
    }
  }
}

async function validateCustomerOTP(commonDetails, otp, loginAttempt) {
  if (!otp) {
    throw new ValidationError('OTP is required for customer login');
  }

  if (loginAttempt?.blockedUntil && new Date() < loginAttempt.blockedUntil) {
    throw new ForbiddenError('Too many attempts. Try again later.');
  }

  const otpDetails = await commonFunctions.findOne('customerOtp', { condition: { customerId: commonDetails.id, otp, status: 'pending' } });
  if (!otpDetails) {
    if (loginAttempt) {
      await commonFunctions.update(
        'loginAttempt',
        { customerId: commonDetails.id },
        { totalAttempts: loginAttempt.totalAttempts + 1 },
      );
    } else {
      await commonFunctions.create('loginAttempt', {
        customerId: commonDetails.id,
        totalAttempts: 1,
        blockedUntil: new Date(),
        mobileNumber: commonDetails.mobileNumber,
      });
    }
    throw new BadRequestError('Please Enter valid OTP!!');
  }

  if (otpDetails.expiresAt < new Date()) {
    await commonFunctions.update('customerOtp', { customerId: commonDetails.id }, { status: 'expired' });
    throw new ForbiddenError('OTP has expired');
  }

  await commonFunctions.update('customerOtp', { customerId: commonDetails.id }, { status: 'verified' });
}

async function handleCustomerLogin(identifier, otp) {
  const commonDetails = await commonFunctions.findOne('customer', { condition: { [Op.or]: [{ email: identifier }, { mobileNumber: identifier }] } });
  if (!commonDetails) {
    throw new BadRequestError(`No customer found with credential ${identifier}`);
  }

  const loginAttempt = await commonFunctions.findOne('loginAttempt', {
    condition: { customerId: commonDetails.id },
  });

  const appConstants = await getAppConfig();

  await validateCustomerStatusAndBlocking(commonDetails, loginAttempt, appConstants);
  await validateCustomerOTP(commonDetails, otp, loginAttempt);

  const token = createToken(commonDetails.id, commonDetails.mobileNumber);
  await saveTokenInDBAndCache('customer', commonDetails.id, token, commonDetails);
  const rolePermissions = await db.rolePermission.findAll({ 
    where: { roleId: commonDetails.roleId }, 
    include: [
      {
        model: db.permission,
        as: 'permission',
        attributes: ['id', 'actionName', 'description'],
      },
    ],
  });

  const permissions = []; 
  for (let item of rolePermissions) {
    if (item?.permission !== null) {
      permissions.push(item.permission);
    }
  }
  return handleSuccess('Customer logged in successfully', {
    userId: commonDetails.id,
    token,
    permissions,
  });
}

async function handleUserLogin(identifier, password) {
  const commonDetails = await commonFunctions.findOne('user', { condition: { [Op.or]: [{ email: identifier }, { mobileNumber: identifier }] } });
  if (!commonDetails) {
    throw new NoDataFoundError(`No user found with credential ${identifier}`);
  }

  if (!commonDetails.isActive) {
    throw new ForbiddenError('User is currently blocked');
  }

  if (!password) {
    throw new ValidationError('Password is required');
  }

  const isPasswordMatch = await commonDetails.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ValidationError('Invalid email or password');
  }

  const token = createToken(commonDetails.id, commonDetails.userName, commonDetails.roleId);
  await saveTokenInDBAndCache('user', commonDetails.id, token, commonDetails); 
  const rolePermissions = await db.rolePermission.findAll({ 
    where: { roleId: commonDetails.roleId }, 
    include: [
      {
        model: db.permission,
        as: 'permission',
        attributes: ['id', 'actionName', 'description'],
      },
    ],
  });
  const role = await commonFunctions.findOne('role', { condition: { id: commonDetails.roleId }});
  const permissions = []; 
  for (let item of rolePermissions) {
    if (item?.permission !== null) {
      permissions.push(item.permission);
    }
  }
  return handleSuccess('User logged in successfully', {
    userId: commonDetails.id,
    userName: commonDetails.userName,
    token,
    permissions,
    role: role.name,
  });
}

exports.commonLogin = async(identifier, password, otp, isCustomerQuery) => {
  const isCustomer = isCustomerQuery === 'true';
  if (isCustomer) {
    return handleCustomerLogin(identifier, otp);
  } else {
    return handleUserLogin(identifier, password);
  }
};

exports.commonLogOut = async(id, isCustomerQuery) => {
  let deleteToken;
  const isCustomer = isCustomerQuery === 'true';
  if (isCustomer) {
    await commonFunctions.update('customerOtp', { customerId: id }, { status: 'expired' });
    deleteToken = await commonFunctions.destroy('customerToken', { customerId: id });
    if (!deleteToken) {
      throw new BadRequestError('Customer not logged out');
    }
    return handleSuccess('Customer logged out successfully');
  } else {
    deleteToken = await commonFunctions.destroy('userToken', { userId: id });
    if (!deleteToken) {
      throw new BadRequestError('User not logged out');
    }
    return handleSuccess('User logged out successfully');
  }
};

exports.generateNewOtp = async({ mobileNumber }) => {
  let otp = '';
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  if (!otp) {
    throw new BadRequestError('Failed in generating OTP');
  }
  const customerDetails = await commonFunctions.findOne('customer', { condition: { mobileNumber } });
  if(customerDetails) {
    await commonFunctions.create('customerOtp', { customerId: customerDetails.id, otp, status: 'pending', expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
  } else {
    const roleDetails = await commonFunctions.findOne('role', 
      { condition: { name: 'customer' } },
    );
    const createCustomer = await commonFunctions.create('customer', { mobileNumber, roleId: roleDetails && roleDetails.id ? roleDetails.id : 3, isActive: true });
    if (!createCustomer) {
      throw new InternalServerError("Internal server error");
    }
    await commonFunctions.create('customerOtp', { customerId: createCustomer.id, otp, status: 'pending', expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
  }
  return handleSuccess('OTP generated successfully !!', otp);
};

exports.forgotPassword = async(body) => {
  const { identifier } = body;
  const userDetails = await commonFunctions.findOne('user', { condition: { [Op.or]: [{ email: identifier }, { mobileNumber: identifier }] } });
  if (!userDetails) {
    throw new NoDataFoundError(`No user found with credential ${identifier}`);
  }
  const check = await commonFunctions.findOne('userOtp', { condition: { userId: userDetails.id, status: 'pending' } });
  if (check && check.expiresAt) {
    if (new Date() < new Date(check.expiresAt)) {
      const remainingMs = new Date(check.expiresAt) - new Date();
      const remainingMinutes = Math.floor(remainingMs / (60 * 1000));
      const remainingSeconds = Math.floor((remainingMs % (60 * 1000)) / 1000);

      throw new BadRequestError(
        `OTP already sent. Please retry in ${remainingMinutes} minute(s) and ${remainingSeconds} second(s)`,
      );
    }
  }
  await commonFunctions.destroy('userOtp', { userId: userDetails.id }, true );
  let otp = '';
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  const generateOtp = await commonFunctions.create('userOtp', 
    { 
      userId: userDetails.id, 
      otp: Number(otp), 
      status: 'pending', 
      expiresAt: new Date(Date.now() + 1 * 60 * 1000), 
    },
  );
  if (!generateOtp) {
    throw new InternalServerError("Internal server error");
  }
  if (userDetails && userDetails.email) {
    const referenceId = Math.floor(10000000 + Math.random() * 90000000);
    let emailBody = forgotPassword
      .replace('${OTP_PLACEHOLDER}', otp)
      .replace('${REFERENCE_ID_PLACEHOLDER}', referenceId);
    const subject = forgotPasswordSubject.replace('${NAME_PLACEHOLDER}', userDetails.userName);
    await sendEmail(userDetails.email, subject, emailBody, null, referenceId);
  }
  return handleSuccess('OTP sent over email successfully !!');
};

exports.verifyOtp = async(body) => {
  const { otp, email } = body;
  const user = await commonFunctions.findOne('user', { condition: { email } });
  const otpDetails = await commonFunctions.findOne('userOtp', { condition: { userId: user.id, otp: Number(otp), status: 'pending' } });
  if (!otpDetails) {
    throw new BadRequestError(`No record found with userId ${email}`);
  } 
  const isExpired = new Date() > new Date(otpDetails.expiresAt);
  if (isExpired) {
    await commonFunctions.update('userOtp', { userId: user.id, otp: Number(otp), status: 'pending' }, { status: 'expired' });
    throw new BadRequestError('OTP has expired');
  }
  if (otpDetails.otp !== Number(otp)) {
    throw new BadRequestError('OTP verification failed');
  }
  await commonFunctions.update('userOtp', { userId: user.id, otp: Number(otp), status: 'pending' }, { status: 'verified' });
  return handleSuccess('OTP verification successfull');
};

exports.resetPassword = async(data) => {
  const { email, newPassword, confirmPassword } = data;
  const userDetails = await commonFunctions.findOne('user', { condition: { email } });
  if (!userDetails) {
    throw new BadRequestError(`No user found with userId ${email}`);
  } 
  if (newPassword !== confirmPassword) throw new BadRequestError('Entered password and confirmed password doesn\'t match');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(confirmPassword, salt);
  const updateUserPassword = await commonFunctions.update('user', { email }, { password: hashedPassword });
  if (updateUserPassword[0] !== 1) {
    throw new InternalServerError(`Unable to update password for userId: ${email}`);
  };
  if (userDetails && userDetails.email) {
    const referenceId = Math.floor(10000000 + Math.random() * 90000000);
    let emailBody = resetPassword.replace('${REFERENCE_ID_PLACEHOLDER}', referenceId);
    const subject = resetPasswordSubject;
    sendEmail(userDetails.email, subject, emailBody, null, referenceId);
  }
  return handleSuccess('Password updated successfully');
};

exports.setNewPassword = async(userId, data, userData) => {
  const { oldPassword, newPassword, confirmPassword } = data;
  if (newPassword !== confirmPassword) throw new BadRequestError('Entered new password and confirmed password doesn\'t match');
  const userDetails = await commonFunctions.findOne('user', { condition: { id: userId } });
  if (!userDetails) {
    throw new BadRequestError(`No user found with userId ${userId}`);
  } 
  if ((userData.id !== userId) && userDetails.roleId !== role.ADMIN ) throw new NoDataFoundError('You don\'t have permission for this');
  const isMatch = await bcrypt.compare(oldPassword, userDetails.password);
  if (!isMatch) {
    throw new BadRequestError('Old password is incorrect.');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  const updateUserPassword = await commonFunctions.update('user', { id: userId }, { password: hashedPassword });
  if (updateUserPassword[0] !== 1) {
    throw new InternalServerError(`Unable to update password for userId: ${userId}`);
  };
  if (userDetails && userDetails.email) {
    const referenceId = Math.floor(10000000 + Math.random() * 90000000);
    let emailBody = setNewPassword.replace('${REFERENCE_ID_PLACEHOLDER}', referenceId);
    const subject = setNewPasswordSubject;
    await sendEmail(userDetails.email, subject, emailBody, null, referenceId);
  }
  return handleSuccess('Password updated successfully !!');
};