import React, { Suspense, memo } from "react";
import styles from "./PostLogin.module.scss";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useDispatch } from "react-redux";
import { setSidebarOpen } from "@/store/slices/globalSlice";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import Loader from "@/components/Loader/Loader";
import DashboardHeaderComponent from "@/components/DashboardHeader/DashboardHeaderComponent";

const HomeLayout = () => {
  const dispatch = useDispatch();
const location = useLocation();
  const toggleSidebarOpen = (flag) => (e) => {
    e.stopPropagation();
    setSidebarOpen !== flag && dispatch(setSidebarOpen(flag));
  };
const isDashboardRoute = location.pathname === '/dashboard';
  return (
    <div className={styles.layout}>
      <Sidebar toggleSidebarOpen={toggleSidebarOpen} />
      <div
        className={styles.rightSideContainer}
        // onMouseOver={toggleSidebarOpen(false)}
      >
        {isDashboardRoute ? <DashboardHeaderComponent /> : <Navbar />}
        <div className={styles.outletDiv}>
          <Suspense fallback={<Loader />}>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default memo(HomeLayout);
