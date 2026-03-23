import axios from "axios";
import { clearOnLogout, env, getToken } from "@/lib/utils";
import toast from "@/lib/toast";

const config = {
  baseURL: env("VITE_API_BASE_URL") + "/api",
  timeout: 30000,
};

const publicRequest = axios.create(config);
const privateRequest = axios.create(config);

const requestHandler = (request) => {
  const token = getToken() || "";
  request.headers.Authorization = `Bearer ${token}`;
  return request;
};
  
const responseErrorHandler = (error) => {
  if (error.response) {
    const { status, data, message } = error.response;
    if (status === 401) {
      clearOnLogout();
      window.location.href = "/";
      toast.warn("Token expired, please login");
    } else {
      toast.error(
        data?.message || data.error || message || "Some Error Occurred"
      );
    }
  } else {
    toast.error(error?.message || "Some Error Occurred");
  }
};

const errorHandler = (error) => {
  return Promise.reject(error);
};

privateRequest.interceptors.request.use(requestHandler, errorHandler);

privateRequest.interceptors.response.use(
  (response) => response,
  responseErrorHandler
);

export { privateRequest, publicRequest };
