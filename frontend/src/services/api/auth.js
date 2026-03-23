import { privateRequest, publicRequest } from "../axios";

const ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  FORGOT_PASSWORD: "/auth/forgot-password",
  OTP_VERIFICATION: "/auth/verify-otp",
  RESET_PASSWORD: "/auth/reset-password",
};

const login = async (data) => {
  const response = await publicRequest.post(ENDPOINTS.LOGIN, data);
  return response?.data;
};

const logout = async () => {
  const response = await privateRequest.post(ENDPOINTS.LOGOUT);
  return response?.data;
};

const forgotPassword = async (data) => {
  try {
    const response = await publicRequest.post(ENDPOINTS.FORGOT_PASSWORD, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const verifyOtp = async (data) => {
  try {
    const response = await publicRequest.post(ENDPOINTS.OTP_VERIFICATION, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const reset = async (data) => {
  try {
    const response = await publicRequest.post(ENDPOINTS.RESET_PASSWORD, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const AuthService = {
  login,
  logout,
  forgotPassword,
  verifyOtp,
  reset,
};

export default AuthService;
