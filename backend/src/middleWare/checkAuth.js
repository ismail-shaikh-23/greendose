/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../utils/constant');
const response = require('../../utils/response');
const redisClient = require('../../utils/redis');
const commonfunctions = require('../../utils/commonFunctions');
const { decrypt } = require('../../utils/crypto');

module.exports = async(req, res, next) => {
  try {
    const checkToken = req.headers.authorization;
    if (!checkToken) return response.unauthorized(res);

    const token = checkToken.split(' ')[1];
    if (!token) return response.unauthorized(res);

    const decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    if (!decoded || !decoded.data) return response.unauthorized(res);

    let userPayload;
    try {
      const decrypted = decrypt(decoded.data);
      userPayload = JSON.parse(decrypted);
    } catch (e) {
      console.error('JWT Decryption Error:', e);
      return response.unauthorized(res);
    }

    let isCustomer = req.query.isCustomer === 'true';

    const tryModels = async(isCustomerFlag) => {
      const tModel = isCustomerFlag ? 'customerToken' : 'userToken';
      const uModel = isCustomerFlag ? 'customer' : 'user';
      const tKey = `${isCustomerFlag ? 'customerToken' : 'userToken'}_${token}`;
      const uKey = `${isCustomerFlag ? 'customer' : 'user'}_${userPayload.id}`;

      let tokenData = null;
      if (redisClient.isOpen) {
        const cachedToken = await redisClient.get(tKey);
        if (cachedToken) {
          tokenData = cachedToken;
        } else {
          tokenData = await commonfunctions.findOne(tModel, { condition: { token } });
          if (tokenData) await redisClient.set(tKey, JSON.stringify(tokenData), { EX: 86400 });
        }
      } else {
        tokenData = await commonfunctions.findOne(tModel, { condition: { token } });
      }

      if (!tokenData) return null;

      let userDetails = null;
      if (redisClient.isOpen) {
        const cachedUser = await redisClient.get(uKey);
        if (cachedUser) {
          userDetails = JSON.parse(cachedUser);
        } else {
          userDetails = await commonfunctions.findOne(uModel, { condition: { id: userPayload.id } });
          if (userDetails) await redisClient.set(uKey, JSON.stringify(userDetails), { EX: 86400 });
        }
      } else {
        userDetails = await commonfunctions.findOne(uModel, { condition: { id: userPayload.id } });
      }

      if (!userDetails) return null;

      req.userData = {
        id: userDetails.id,
        userName: userDetails.userName || null,
        role: userDetails.roleId,
      };

      if (isCustomerFlag) {
        req.userData.mobileNumber = userDetails.mobileNumber;
      }

      return true;
    };

    if (req.query.isCustomer !== undefined) {
      const ok = await tryModels(isCustomer);
      if (!ok) return response.unauthorized(res);
    } else {
      const okAsUser = await tryModels(false);
      if (!okAsUser) {
        const okAsCustomer = await tryModels(true);
        if (!okAsCustomer) return response.unauthorized(res);
      }
    }

    next();
  } catch (err) {
    console.error('Auth Error:', err);
    return response.unauthorized(res);
  }
};