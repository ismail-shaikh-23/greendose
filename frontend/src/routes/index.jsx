import { createBrowserRouter, Navigate } from "react-router-dom";
import routes from "./routes";
import ConditionalRoute from "@/components/ConditionalRoute/ConditionalRoute";
import PreLogin from "@/layouts/PreLogin/PreLogin";
import PostLogin from "@/layouts/PostLogin/PostLogin";
import PageNotFound from "@/pages/PageNotFound/PageNotFound";
import { checkPermission } from "@/lib/utils";

const buildRoutes = (routesObj, check = true, permissions) => {
  return Object.values(routesObj)
    .filter(
      (x) =>
        !check ||
        (permissions
          ? permissions?.includes?.(x.permissionName)
          : checkPermission(x.permissionName)) ||
        x.children
    )
    .map(({ path, element, children }) => ({
      path,
      element,
      ...(children
        ? { children: buildRoutes(children, check, permissions) }
        : {}),
    }));
};

const privateRoutes = buildRoutes(routes.privateRoutes);
const defaultRoute = privateRoutes?.[0]?.path;

const getRouter = (permissions) => [
  // Redirect root to login
  {
    path: "/",
    element: <Navigate to={routes.publicRoutes.LOGIN.path} replace />,
  },

  // Public routes
  {
    path: "/",
    element: <ConditionalRoute component={PreLogin} />,
    children: [
      // {
      //   index: true,
      //   element: <Navigate to={routes.publicRoutes.LOGIN.path} />,
      // },
      ...buildRoutes(routes.publicRoutes, false),
    ],
  },

  // Private routes
  {
    path: "/",
    element: <ConditionalRoute isPrivate component={PostLogin} />,
    children: [
      ...buildRoutes(routes.privateRoutes, true, permissions),
      {
        index: true,
        element: <Navigate to={"/login"} />,
      },
    ],
  },

  // Catch-all
  {
    path: "*",
    element: <PageNotFound />,
  },
];

export default getRouter;
