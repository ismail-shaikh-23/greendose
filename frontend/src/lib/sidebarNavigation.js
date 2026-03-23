import routes from "@/routes/routes";

export const sideBarNavigation = Object.values(routes.privateRoutes)
  .filter((x) => x?.sidebar?.show || x.children)
  .map((pageData, index) => {
    const data = {
      id: index + 1,
      path: pageData.path,
      icon: pageData.sidebar.icon,
      pageName: pageData.sidebar.name || pageData.pageName,
      permissionName: pageData.permissionName,
    };
    if (pageData.children) {
      data.children = Object.values(pageData.children).filter(
        (x) => x?.sidebar?.show
      );
    }
    return data;
  });
