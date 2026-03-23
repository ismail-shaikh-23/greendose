/* eslint-disable max-len */
const commonfunctions = require('../../utils/commonFunctions');
const { InternalServerError, ValidationError } = require('../../utils/customError');
const db = require('../models');

const serviceName = 'checkVendor: middleware';
module.exports = async(req, res, next) => {
  try { 
    const role = await commonfunctions.findByPk('role', req.userData.role);
    if (role.name.toLowerCase() === 'admin') { // by pass admin
      next();
      return;
    } 
    const options = {};
    options.condition = { status: 'approved' }
    options.include = [
      {
        model: db.user,
        attributes: [],
        as: 'users',
        where: {
          id: req.userData.id
        }
      }
    ];
    const fetchVendor = await commonfunctions.findOne('vendor', options);

    if(!fetchVendor) {
      throw new ValidationError(`Invalid vendor`);
    }
    req.vendor = {
      vendorId: fetchVendor.id,
      vendorUserId: req.userData.id,
    };
    next();
  } catch (e) {
    console.log(`Error in ${serviceName}`, e);
  }
};