import { createEnum } from "./utils";

const MODAL_ID = {
  ADD_USER: "add-user",
  ADD_ROLE: "add-role",
  ADD_PERMISSION: "add-permission",
  ADD_CATEGORY: "add-category",
  ADD_CAMPAIGN: "add-campaign",
  ADD_SUBCATEGORY: "add-sub-category",
  ADD_VENDOR: "add-vendor",
  ADD_PRODUCT: "add-product",
  ADD_OFFER: "add-offer",
  CONFIRM_DELETE: "confirm-delete-done",
  VIEW_IMAGE: "view-image",
  VIEW_OFFERS: "view-offers",
  VENDOR_REJECTION: "vendor-rejection",
  FILTER_MODAL: "filter-modal",
  SHARE_MODAL :"share-modal"
};


const PAGINATION = {
  DEFAULT_ROWS_PER_PAGE: 10,
  DEFAULT_PAGE_NUMBER: 1,
};

const VENDOR_TYPES = {
  "cosmetic store": "Cosmetic Store",
  pharmacy: "Pharmacy",
  other: "Other",
};
createEnum(VENDOR_TYPES);

const UNIT_TYPES ={
   mg : "mg",
   g : "g", 
   kg : "kg", 
   ml:"ml",
   l:"l", 
  unit:"unit  "
}
createEnum(UNIT_TYPES)

const OFFER_TYPES = { product: "Product", cart: "Cart" };
createEnum(OFFER_TYPES);

const DISCOUNT_TYPES = { percentage: "Percentage", flat: "Flat" };
createEnum(DISCOUNT_TYPES);

const VALIDATION_ERROR_MESSAGES = {
  EMAIL_FORMAT: "Invalid email format!",
  PASSWORD_FORMAT: "Invalid password format!",
  ONLY_NUMBERS: "Only numeric values allowed!",
  INVALID_MOBILE: "Invalid mobile number!",
  ZIP_CODE_FORMAT: "Invalid ZIP code!",
};
createEnum(VALIDATION_ERROR_MESSAGES);

const VENDOR_STATUS = ["pending", "approved", "rejected"];
createEnum(VENDOR_STATUS);


const CURRENCY_SYMBOL = {
  AE: "AED",
};

const PAYMENT_STATUS = ["pending", "paid", "failed", "refunded"];
createEnum(PAYMENT_STATUS);

const ORDER_STATUS = ["pending", "success", "failed"];
createEnum(ORDER_STATUS);

const DELIVERY_STATUS = [
  "placed",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "cancelled",
];
createEnum(DELIVERY_STATUS);

export {
  MODAL_ID,
  PAGINATION,
  VENDOR_TYPES,
  OFFER_TYPES,
  DISCOUNT_TYPES,
  VALIDATION_ERROR_MESSAGES,
  VENDOR_STATUS,
  UNIT_TYPES,
  CURRENCY_SYMBOL,
  PAYMENT_STATUS,
  ORDER_STATUS,
  DELIVERY_STATUS,
};
