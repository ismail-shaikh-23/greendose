import globalSlice from "./slices/globalSlice";
import userSlice from "./slices/userSlice";
import roleSlice from "./slices/roleSlice";
import permissionSlice from "./slices/permissionSlice";
import categorySlice from "./slices/categorySlice";
import subCategorySlice from "./slices/subCategorySlice";
import vendorSlice from "./slices/vendorSlice";
import productSlice from "./slices/productSlice";
import offerSlice from "./slices/offerSlice";
import dashboardSlice from "./slices/dashboardSlice";
import campaignSlice from "./slices/campaignSlice";
import orderSlice from "./slices/orderSlice"
const rootReducer = {
  global: globalSlice,
  user: userSlice,
  role: roleSlice,
  permission: permissionSlice,
  category: categorySlice,
  subCategory: subCategorySlice,
  product: productSlice,
  vendor: vendorSlice,
  offer: offerSlice,
  dashboard:dashboardSlice,
  campaign: campaignSlice,
  order: orderSlice
};

export default rootReducer;
