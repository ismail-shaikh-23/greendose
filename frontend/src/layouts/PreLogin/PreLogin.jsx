import React, { memo, Suspense } from "react";
import styles from "./PreLogin.module.scss";
import { Outlet } from "react-router-dom";
import Loader from "@/components/Loader/Loader";
import logo from "@/assets/svg/greendose_logo.svg";
import greendose_img from "@/assets/png/greendose_img.png";

const PreLogin = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.logo}>
        {/* <div className={styles.inner_logo}>
          <img alt="logo" src={logo} width={200} />{" "}
        </div> */}
        <div className={styles.main_img}>
          <img alt="green-dose" src={greendose_img} />
        </div>
      </div>
      {/* <span className={styles.wrapTriangle}>
        <span className={styles.triangle}></span>
      </span> */}
      <Suspense fallback={<Loader />}>
        <span className={styles.childrenContainer}>
          <Outlet />
        </span>
      </Suspense>
    </div>
  );
};

export default memo(PreLogin);
