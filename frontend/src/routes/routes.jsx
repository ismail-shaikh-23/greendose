import React from "react";

// sidebar icons
import Permissions from "@/pages/Permissions/Permissions";
import RolePermission from "@/pages/Roles/components/RolePermission/RolePermission";
import Product from "@/pages/Product/Product";
import Vendors from "@/pages/Vendor/Vendors";
import Offers from "@/pages/Offers/Offers";
import DashboardIcon from "@/components/SVGComponents/DashboardIcon";
import UserIcon from "@/components/SVGComponents/UserIcon";
import CategoryIcon from "@/components/SVGComponents/CategoryIcon";
import SubCategoryIcon from "@/components/SVGComponents/SubCategoryIcon";
import VendorsIcon from "@/components/SVGComponents/VendorsIcon";
import ProductsIcon from "@/components/SVGComponents/ProductsIcon";
import OffersIcon from "@/components/SVGComponents/OffersIcon";
import RolesNPermissionsIcon from "@/components/SVGComponents/RolesNPermissionsIcon";
import CampaignIcon from "@/components/SVGComponents/Campaign";
import OrdersIcon from "@/components/SVGComponents/OrdersIcon";
import VendorRegistration from "@/pages/VendorRegistration/VendorRegistration";
import OrderDetails from "@/pages/OrderDetails/OrderDetails";

// Lazy-load components
const ForgotPassword = React.lazy(
  () => import("@/pages/ForgotPassword/ForgotPassword")
);
const OtpVerification = React.lazy(
  () => import("@/pages/OtpVerification/OtpVerification")
);
const Login = React.lazy(() => import("@/pages/Login/Login"));
const ResetPassword = React.lazy(
  () => import("@/pages/ResetPassword/ResetPassword")
);
const Dashboard = React.lazy(() => import("@/pages/Dashboard/Dashboard"));
const Users = React.lazy(() => import("@/pages/Users/Users"));
const Roles = React.lazy(() => import("@/pages/Roles/Roles"));
const Category = React.lazy(() => import("@/pages/Category/Category"));
const SubCategory = React.lazy(() => import("@/pages/SubCategory/SubCategory"));
const Campaign = React.lazy(() => import("@/pages/Campaign/Campaign"));
const Orders = React.lazy(() => import("@/pages/Orders/Orders"));

const routes = {
  publicRoutes: {
    LOGIN: {
      path: "/login",
      element: <Login />,
    },
    FORGOT_PASSWORD: {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    OTP_VERIFICATION: {
      path: "/otp-verification",
      element: <OtpVerification />,
    },
    RESET_PASSWORD: {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    VENDOR_REGISTRATION: {
      path: "/registration",
      element: <VendorRegistration />,
    },
  },
  privateRoutes: {
    DASHBOARD: {
      path: "/dashboard",
      element: <Dashboard />,
      pageName: "Dashboard",
      sidebar: {
        show: true,
        icon: DashboardIcon,
      },
      permissionName: "get dashboard analytics",
    },
    USERS: {
      path: "/users",
      element: <Users />,
      pageName: "Users",
      sidebar: {
        show: true,
        icon: UserIcon,
      },
      permissionName: "get user list",
    },
    CATEGORY: {
      path: "/category",
      element: <Category />,
      pageName: "Category",
      sidebar: {
        show: true,
        icon: CategoryIcon,
      },
      permissionName: "get category list",
    },
    SUB_CATEGORY: {
      path: "/subcategory",
      element: <SubCategory />,
      pageName: "Sub Category",
      sidebar: {
        show: true,
        icon: SubCategoryIcon,
      },
      permissionName: "get sub-category list",
    },
    ORDERS: {
      path: "/order",
      element: <Orders />,
      pageName: "Orders",
      sidebar: {
        show: true,
        icon: OrdersIcon,
      },
      permissionName: "get order list",
    },
    ORDER_DETAILS: {
      path: "/order/:orderId",
      element: <OrderDetails />,
      pageName: "Order Details",
      permissionName: "get order list",
      showBackIcon: true,
    },
    CAMPAIGN: {
      path: "/campaign",
      element: <Campaign />,
      pageName: "Campaign",
      sidebar: {
        show: true,
        icon: CampaignIcon,
      },
      permissionName: "update campaign status",
    },
    VENDOR: {
      path: "/vendor",
      element: <Vendors />,
      pageName: "Vendor",
      sidebar: {
        show: true,
        icon: VendorsIcon,
      },
      permissionName: "get vendor list",
    },
    PRODUCT: {
      path: "/product",
      element: <Product />,
      pageName: "Products",
      sidebar: {
        show: true,
        icon: ProductsIcon,
      },
      permissionName: "get product list",
    },
    OFFER: {
      path: "/offer",
      element: <Offers />,
      pageName: "Offers",
      sidebar: {
        show: true,
        icon: OffersIcon,
      },
      permissionName: "update campaign status",
    },

    ROLES_AND_PERMISSIONS: {
      path: "/roles-permissions",
      pageName: "Roles & Permissions",
      sidebar: {
        show: true,
        icon: RolesNPermissionsIcon,
      },
      children: {
        ROLES: {
          path: "roles",
          element: <Roles />,
          pageName: "Roles",
          sidebar: {
            show: true,
            icon: UserIcon,
          },
          permissionName: "get role list",
        },
        EDIT_ROLE: {
          path: "roles/:roleId",
          element: <RolePermission />,
          pageName: "Edit Role",
          permissionName: "get role permission list",
        },
        PERMISSIONS: {
          path: "permissions",
          element: <Permissions />,
          pageName: "Permissions",
          sidebar: {
            show: true,
            icon: UserIcon,
          },
          permissionName: "get permission list",
        },
      },
    },
  },
};

export default routes;
