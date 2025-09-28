import axiosInstance from "./axiosConfig";

export const listEmployee = () => axiosInstance.get("employees/");
export const createEmployee = (data) => axiosInstance.post("employees/", data);
export const getEmployee = (id) => axiosInstance.get(`employees/${id}/`);
export const updateEmployee = (id, data) => axiosInstance.put(`employees/${id}/`, data);
export const deleteEmployee = (id) => axiosInstance.delete(`employees/${id}/`);
export const partialUpdateEmployee = (id, data) => axiosInstance.patch(`employees/${id}/`, data);
// export const assignDepartmentToEmployee = (empId, deptId) => axiosInstance.post(`employees/${empId}/assign_department/`, { department_id: deptId });
// export const removeDepartmentFromEmployee = (empId, deptId) => axiosInstance.post(`employees/${empId}/remove_department/`, { department_id: deptId });   