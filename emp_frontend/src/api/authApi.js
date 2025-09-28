import axiosInstance from "./axiosConfig";

export const signup = (data) => axiosInstance.post("signup/", data);
export const login = (data) => axiosInstance.post("login/", data);
export const logout = () => axiosInstance.post("logout/");
export const refreshToken = (data) => axiosInstance.post("token/refresh", data);
