  import React, { memo, useState } from "react";
  import styles from "../PostLogin.module.scss";
  import { sideBarNavigation } from "@/lib/sidebarNavigation";
  import { NavLink, useLocation, useNavigate } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import { checkPermission, clearOnLogout, combineClasses } from "@/lib/utils";
  import { clear } from "@/store/slices/globalSlice";
  import routes from "@/routes/routes";
  import LogoutIcon from "@/components/SVGComponents/LogoutIcon";
  import AuthService from "@/services/api/auth";
  import ArrowIcon from "@/components/SVGComponents/ArrowIcon";
  import PropTypes from "prop-types";
  import Logo from "@/assets/png/logo.png";
  import HrLine from "@/assets/png/hr_line.png";
  const Sidebar = ({ toggleSidebarOpen }) => {
    const { sidebarOpen } = useSelector((state) => state.global);
    const [openDropdown, setOpenDropdown] = useState("");

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logout = async () => {
      await AuthService.logout();
      clearOnLogout();
      dispatch(clear());
      navigate(routes.publicRoutes.LOGIN.path);
    };

    const toggleDropdown = (id) => () => {
      setOpenDropdown((prev) => (prev === id ? "" : id));
    };

    return (
      <div
        className={combineClasses(
          styles.leftSideContainer,
          !sidebarOpen ? styles.sidebarClosed : styles.sidebarOpen
        )}
        // onMouseOver={toggleSidebarOpen(true)}
      >
        <div className={styles.logoContainer}>
          <div className={styles.iconContainer}>
            <div className={styles.mainIconDiv}>
              <img src={Logo} alt="GD logo" className={styles.mainIconImage} />
            </div>
          </div>
        </div>
        <div className={styles.mainHrLine}>
          <img src={HrLine} alt="GD logo" className={styles.hrLineImage} />
        </div>
        <div className={styles.navContainer}>
          {sideBarNavigation
            .filter(
              (data) => checkPermission(data.permissionName) || data.children
            )
            .map((data) => {
              const children = data?.children?.filter((child) =>
                checkPermission(child.permissionName)
              );
              const { icon: Icon } = data;
              if (children?.length) {
                return (
                  <React.Fragment key={data.id}>
                    <div
                      key={data.id}
                      onClick={toggleDropdown(data.id)}
                      className={combineClasses(
                        styles.navLink,
                        !sidebarOpen && styles.sidebarClosed,
                        openDropdown === data.id && styles.activeLink
                      )}
                    >
                      <div className={styles.linksNames}>
                        <Icon className={styles.icon} />
                        {sidebarOpen && (
                          <p className={styles.linkPageName}>{data.pageName}</p>
                        )}
                      </div>
                      <ArrowIcon
                        className={styles.arrowIcon}
                        style={{
                          transform:
                            openDropdown === data.id
                              ? "rotate(-90deg)"
                              : "rotate(90deg)",
                          transition: "transform ease 300ms",
                        }}
                      ></ArrowIcon>
                    </div>
                    {openDropdown === data.id && (
                      <div className={styles.leftBorder}>
                        {children.map((child) => {
                          return (
                            <NavLink
                              key={child.id}
                              className={({ isActive }) =>
                                `${styles.navLink} ${styles.childNavLink} ${!sidebarOpen ? styles.sidebarClosed : ""} ${isActive && styles.activeLink}`
                              }
                              to={`${data.path}/${child.path}`}
                              style={{}}
                              state={{ previousPath: location.pathname }}
                            >
                              <div className={styles.linksNames}>
                                <Icon className={styles.icon} />
                                {sidebarOpen && (
                                  <p className={styles.linkPageName}>
                                    {child.pageName}
                                  </p>
                                )}
                              </div>
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </React.Fragment>
                );
              } else if (!children) {
                return (
                  <NavLink
                    key={data.id}
                    className={({ isActive }) =>
                      `${styles.navLink} ${!sidebarOpen ? styles.sidebarClosed : ""} ${isActive && styles.activeLink}`
                    }
                    to={data.path}
                    state={{ previousPath: location.pathname }}
                    onClick={toggleDropdown("")}
                  >
                    <div className={styles.linksNames}>
                      <Icon className={styles.icon} />
                      {sidebarOpen && (
                        <p className={styles.linkPageName}>{data.pageName}</p>
                      )}
                    </div>
                  </NavLink>
                );
              }
            })}
        </div>
        <div
          className={`${styles.navLink} ${styles.logoutButton} ${!sidebarOpen ? styles.sidebarClosed : ""}`}
          onClick={logout}
        >
          <div className={styles.linksNames}>
            <LogoutIcon className={styles.icon} />
            {sidebarOpen && <p className={styles.linkPageName}>Logout</p>}
          </div>
        </div>
      </div>
    );
  };

  Sidebar.propTypes = {
    toggleSidebarOpen: PropTypes.func.isRequired,
  };

  export default memo(Sidebar);
