/* eslint-disable max-len */
module.exports = {
  GENERAL_ERROR: {
    DATA_NOT_FOUND: { message: 'Data not found', code: 100 },
    DATA_ALREADY_EXISTS: { message: 'Data already exists', code: 101 },
    INVALID_INPUT: { message: 'Invalid input', code: 102 },
    UNAUTHORIZED: { message: 'Unauthorized action', code: 103 },
    FORBIDDEN: { message: 'Forbidden', code: 104 },
    SERVER_ERROR: { message: 'Internal server error', code: 105 },
  },

  PERMISSION_ERROR: {
    FORBIDDEN: { message: 'You do not have permission to perform this action', code: 403 },
    UNAUTHORIZED: { message: 'You are not authorized, please sign in.', code: 401 },
  },

  USER_ERROR: {
    ALREADY_EXISTS: { message: 'User already exists', code: 200 },
    NOT_FOUND: { message: 'User not found', code: 201 },
    INVALID_CREDENTIALS: { message: 'Invalid username or password', code: 202 },
    BLOCKED: { message: 'User is blocked', code: 203 },
    INACTIVE: { message: 'User account is inactive', code: 204 },
  },

  VENDOR_ERROR: {
    ALREADY_EXISTS: { message: 'Vendor already exists', code: 300 },
    NOT_FOUND: { message: 'Vendor not found', code: 301 },
    PENDING_APPROVAL: { message: 'Vendor is pending approval', code: 302 },
    REJECTED: { message: 'Vendor has been rejected', code: 303 },
    APPROVED: { message: 'Vendor approved', code: 304 },
    LICENSE_NOT_FOUND: { message: 'Vendor license file not found', code: 305 },
  },

  CUSTOMER_ERROR: {
    ALREADY_EXISTS: { message: 'Customer already exists', code: 400 },
    NOT_FOUND: { message: 'Customer not found', code: 401 },
    ADDRESS_NOT_FOUND: { message: 'Customer address not found', code: 402 },
  },

  ROLE_ERROR: {
    ALREADY_EXISTS: { message: 'Role already exists', code: 500 },
    NOT_FOUND: { message: 'Role not found', code: 501 },
  },

  PERMISSION_MODULE_ERROR: {
    ALREADY_EXISTS: { message: 'Permission already exists', code: 502 },
    NOT_FOUND: { message: 'Permission not found', code: 503 },
    ROLE_PERMISSION_EXISTS: { message: 'Role permission already exists', code: 504 },
    ROLE_PERMISSION_NOT_FOUND: { message: 'Role permission not found', code: 505 },
  },

  PRODUCT_ERROR: {
    ALREADY_EXISTS: { message: 'Product already exists', code: 600 },
    NOT_FOUND: { message: 'Product not found', code: 601 },
    OUT_OF_STOCK: { message: 'Product out of stock', code: 602 },
    EXPIRED: { message: 'Product expired', code: 603 },
  },

  CATEGORY_ERROR: {
    ALREADY_EXISTS: { message: 'Category already exists', code: 700 },
    NOT_FOUND: { message: 'Category not found', code: 701 },
  },

  SUBCATEGORY_ERROR: {
    ALREADY_EXISTS: { message: 'Sub-category already exists', code: 702 },
    NOT_FOUND: { message: 'Sub-category not found', code: 703 },
  },

  OFFER_ERROR: {
    ALREADY_EXISTS: { message: 'Offer already exists', code: 800 },
    NOT_FOUND: { message: 'Offer not found', code: 801 },
    EXPIRED: { message: 'Offer expired', code: 802 },
    USAGE_LIMIT_EXCEEDED: { message: 'Offer usage limit exceeded', code: 803 },
  },

  ORDER_ERROR: {
    ALREADY_EXISTS: { message: 'Order already exists', code: 900 },
    NOT_FOUND: { message: 'Order not found', code: 901 },
    CANNOT_BE_CANCELLED: { message: 'Order cannot be cancelled', code: 902 },
    INVALID_STATUS: { message: 'Invalid order status', code: 903 },
  },

  CART_ERROR: {
    NOT_FOUND: { message: 'Cart not found', code: 1000 },
    ITEM_NOT_FOUND: { message: 'Cart item not found', code: 1001 },
  },

  PAYMENT_ERROR: {
    NOT_FOUND: { message: 'Payment not found', code: 1100 },
    FAILED: { message: 'Payment failed', code: 1101 },
    ALREADY_PROCESSED: { message: 'Payment already processed', code: 1102 },
  },

  CAMPAIGN_ERROR: {
    ALREADY_EXISTS: { message: 'Campaign already exists', code: 1200 },
    NOT_FOUND: { message: 'Campaign not found', code: 1201 },
    REJECTED: { message: 'Campaign has been rejected', code: 1202 },
  },

  FILE_ERROR: {
    NOT_FOUND: { message: 'File not found', code: 1300 },
    UPLOAD_FAILED: { message: 'File upload failed', code: 1301 },
  },

  REFUND_ERROR: {
    REQUEST_NOT_FOUND: { message: 'Refund request not found', code: 1400 },
    ALREADY_PROCESSED: { message: 'Refund request already processed', code: 1401 },
  },

  SUPPORT_ERROR: {
    TICKET_NOT_FOUND: { message: 'Support ticket not found', code: 1500 },
    TICKET_ALREADY_RESOLVED: { message: 'Support ticket already resolved', code: 1501 },
  },

  DATE_ERROR: {
    INVALID_START_DATE: { message: 'Start date cannot be after end date', code: 1600 },
    INVALID_END_DATE: { message: 'End date cannot be before start date', code: 1601 },
    DATE_RANGE_OVERLAP: { message: 'Date range overlaps with existing record', code: 1602 },
  },
};
