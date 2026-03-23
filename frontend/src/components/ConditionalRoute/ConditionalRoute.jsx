import React from "react";
import { Navigate } from "react-router-dom";
import { checkPermission, getToken } from "@/lib/utils";
import routes from "@/routes/routes";

const ConditionalRoute = (props) => {
  const { component: Component, isPrivate = false } = props;
  const isAuthenticated = !!getToken();

  if (isPrivate && !isAuthenticated) {
    return <Navigate to="/login" />;
  } else if (!isPrivate && isAuthenticated) {
    return (
      <Navigate
        to={
          Object.values(routes.privateRoutes).find((route) =>
            checkPermission(route.permissionName)
          )?.path
        }
      />
    );
  }
  return <Component />;
};

export default ConditionalRoute;
