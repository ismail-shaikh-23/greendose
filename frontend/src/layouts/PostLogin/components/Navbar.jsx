import React, { memo, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "@/routes/routes";
import styles from "../PostLogin.module.scss";
import profilePic from "@/assets/png/profile.png";
import { getCurrentUser } from "@/lib/utils";
import BackArrowIcon from "@/components/SVGComponents/BackArrowIcon";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = getCurrentUser("email") || "user@gmail.com";

  const removeLastEndpoint = (str) => str.split("/").slice(0, -1).join("/");

  const currentRoute = useMemo(() => {
    let temp = {};
    const obj = Object.values(routes.privateRoutes)
      .flatMap((x) =>
        x?.children
          ? Object.values(x.children).map((y) => ({
              ...y,
              path: `${x.path}/${y.path}`,
            }))
          : [x]
      )
      .find((pathData) => {
        return (
          pathData.path === location.pathname ||
          (pathData.path.endsWith("Id") &&
            removeLastEndpoint(pathData.path) ===
              removeLastEndpoint(location.pathname))
        );
      });
    if (obj) {
      temp = obj;
    }
    return temp || "";
  }, [location]);

  return (
    <div className={styles.topBarContainer}>
      <div className={styles.leftSide}>
        {currentRoute?.showBackIcon && (
          <BackArrowIcon
            className={styles.backIcon}
            onClick={() => navigate(-1)}
          />
        )}
        <p className={styles.pageName}>{currentRoute?.pageName || ""}</p>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.logoutCircle}>
          <img className={styles.profilePic} src={profilePic} alt="profile" />
          {/* <span className={styles.userName}>{email}</span> */}
        </div>
      </div>
    </div>
  );
};

export default memo(Navbar);
