const commonFunctions = require('../../utils/commonFunctions');
const constants = require('../../utils/constant');

exports.insertIntoErrorLogger = async(
  message, stackTrace, 
  originalUrl, ipAddress, method, userAgent, 
  userData,
) => {
  let actorType = null;
  try {
    
    if (userData) {
      var { role, id } = userData;
      if (role === constants.role.SUPERADMIN) {
        actorType = constants.role.STRING_ENUM.SUPERADMIN;
      } else if (role === constants.role.ADMIN) {
        actorType = constants.role.STRING_ENUM.ADMIN;
      } else if (role === constants.role.CUSTOMER) {
        actorType = constants.role.STRING_ENUM.CUSTOMER;
      } else {
        actorType = constants.role.STRING_ENUM.VENDORUSER;
      }
    }

    await commonFunctions.create('errorLogger', {
      message,
      stackTrace,
      url: originalUrl,
      method,
      ipAddress,
      userAgent,
      actorId: id ? id : null,
      actorType,
    });

  } catch (error) {

    await commonFunctions.create('errorLogger', {
      message: error.message,
      stackTrace: error.stackTrace,
      url: originalUrl,
      method,
      ipAddress,
      userAgent,
      actorId: id ? id : null,
      actorType,
    });

  }
};