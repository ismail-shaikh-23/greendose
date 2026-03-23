const path = require('path'); 
 
const JWT_SECRET = 'qwertyuiopasdfghjklzxcvbnm'; 
const folderPath = path.join(__dirname, '../public/uploads'); 
const filePath = path.join(__dirname, '../public'); 
const WINDOW_SIZE = 60;
const MAX_REQUESTS = 100;
const ENCRYPTION_SECRET = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
const TAG_PRODUCT_REDIS_KEY = 'globalTagProductMap';

const offer = {
  INAPP_STATUS: {
    ACTIVE: 'active', 
    EXPIRED: 'expired', 
    INACTIVE: 'inactive',
  },
  APPROVAL_STATUS: {
    PENDING: 'pending', 
    APPROVED: 'approved', 
    REJECTED: 'rejected',
  },
  TYPE: {
    PERCENTAGE: 'percentage',
    FLAT: 'flat',
  },
  MAX_BATCH_SIZE: 500,
};

const role = {
  ADMIN: 1,
  CUSTOMER: 3,
  VENDORUSER: 2,
  SUPERADMIN: 4,
  STRING_ENUM: {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    VENDORUSER: 'vendor-user',
    SUPERADMIN: 'super-admin',
  },
};

const sortingOrder = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const vendorStatus = {
  PENDING: 'pending',
  REJECTED: 'rejected',
  APPROVED: 'approved',
};

module.exports = { 
  JWT_SECRET, 
  filePath, 
  folderPath, 
  offer,
  sortingOrder,
  role,
  vendorStatus,
  WINDOW_SIZE,
  MAX_REQUESTS,
  ENCRYPTION_SECRET,
  TAG_PRODUCT_REDIS_KEY,
};
