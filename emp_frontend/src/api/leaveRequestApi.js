import axiosInstance from "./axiosConfig";

export const listLeaveRequests = () => axiosInstance.get("leaverequests/");
export const createLeaveRequest = (data) => axiosInstance.post("leaverequests/", data);
export const getLeaveRequest = (id) => axiosInstance.get(`leaverequests/${id}/`);
export const updateLeaveRequest = (id, data) => axiosInstance.put(`leaverequests/${id}/`, data);
export const deleteLeaveRequest = (id) => axiosInstance.delete(`leaverequests/${id}/`);
export const partialUpdateLeaveRequest = (id, data) => axiosInstance.patch(`leaverequests/${id}/`, data);   
