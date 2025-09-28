import axiosInstance from "./axiosConfig";

export const listAttendence = () => axiosInstance.get("attendances/");
export const createAttendence = (data) => axiosInstance.post("attendances/", data);
export const getAttendence = (id) => axiosInstance.get(`attendances/${id}/`);
export const updateAttendence = (id, data) => axiosInstance.put(`attendances/${id}/`, data);
export const deleteAttendence = (id) => axiosInstance.delete(`attendances/${id}/`);
export const partialUpdateAttendence = (id, data) => axiosInstance.patch(`attendances/${id}/`, data);