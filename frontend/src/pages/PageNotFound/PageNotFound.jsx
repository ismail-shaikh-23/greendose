import React from "react";
import { Link } from "react-router-dom";

import styles from "./PageNotFound.module.scss";
import routes from "@/routes/routes";
import { checkPermission } from "@/lib/utils";

const PageNotFound = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - Page Not Found</h1>
      <p className={styles.message}>Looks like you're lost.</p>

      <Link
        to={
          Object.values(routes.privateRoutes).find((route) =>
            checkPermission(route.permissionName)
          )?.path
        }
        className={styles.link}
      >
        <p>Go back home</p>
      </Link>
    </div>
  );
};
export default PageNotFound;
