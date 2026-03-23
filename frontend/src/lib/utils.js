// import routes from "@/routes/routes";

export const saveToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const getToken = () => localStorage.getItem("access_token");

export const getCurrentUser = (key) => {
  const data = JSON.parse(localStorage.getItem("user") || "{}");
  switch (key) {
    case "email":
      return data?.email;
    case "userId":
      return data?.userId;
    case "userName":
      return data?.userName;
    case "permissions":
      return data.permissions;
    default:
      return data;
  }
};

export const clearOnLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};

export const combineClasses = (...classes) => classes.filter(Boolean).join(" ");

export const env = (key) => {
  return key ? import.meta.env[key] : import.meta.env;
};

export const requiredMessage = (name) => `${name} is required!`;

export const onlyNumbersInput = (e) => {
  ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();
};

export const capitalizeText = (text) => {
  if (!text) return "";
  return text
    ?.split(" ")
    ?.map((x) => x[0].toUpperCase() + x.slice(1))
    ?.join(" ");
};

export const getInitialValues = (config) =>
  Object.fromEntries(
    Object.entries(config).map(([key, val]) => [key, val.defaultValue])
  );

export const getSelectOptions = (data, labelKey = "name", valueKey = "id") =>
  data?.map?.((row) => ({
    label: row?.[labelKey] ?? row,
    value: row?.[valueKey] ?? row,
  })) || [];

export const createEnum = (obj) => {
  Object.freeze(obj);
};

export const dateConverter = (str) => {
  const d = new Date(str);
  let mm = d.getMonth() + 1;
  let dd = d.getDate();

  return [
    (dd > 9 ? "" : "0") + dd,
    (mm > 9 ? "" : "0") + mm,
    d.getFullYear(),
  ].join("-");
};

export const inputDateFormat = (date) =>
  date ? new Date(date).toISOString().split("T")[0] : "";

export const updateParams = (params, setParams) => {
  setParams((prev) => {
    Object.entries(params || {}).forEach(([key, value]) => {
      prev.set(key, value);
    });
    return prev;
  });
};

export const addBaseUrl = (url) => {
  const baseUrl = env("VITE_API_BASE_URL");
  return baseUrl && url ? `${baseUrl}/${url}` : url || "";
};

export const checkPermission = (permission = null) => {
  const permissions = getCurrentUser("permissions") || [];
  return permissions.includes(permission?.toLowerCase?.());
};

export const conditionalColumns = (condition, columns) => {
  const colArray = Array.isArray(columns) ? columns : [columns];
  return condition ? colArray : [];
};

export const formatNumberWithSuffix = (value, roundDigits = 1) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(roundDigits)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(roundDigits)}k`;
  return value.toString();
};

// export const getRedirectPath = () =>
//   Object.values(routes.privateRoutes).find((route) =>
//     checkPermission(route.permissionName)
//   )?.path;

