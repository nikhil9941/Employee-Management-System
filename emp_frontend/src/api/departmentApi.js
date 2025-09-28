import axiosInstance from "./axiosConfig";

export const listDepartments = () => axiosInstance.get("departments/");
export const createDepartment = (data) => axiosInstance.post("departments/",data);
export const getDepartment = (id) => axiosInstance.get(`departments/${id}/`);
export const updateDepartment = (id, data) => axiosInstance.put(`departments/${id}/`, data);
export const deleteDepartment = (id) => axiosInstance.delete(`departments/${id}/`);
export const partialUpdateDepartment = (id, data) => axiosInstance.patch(`departments/${id}/`, data);
// export const assignEmployeeToDepartment = (deptId, empId) => axiosInstance.post(`departments/${deptId}/assign_employee/`, { employee_id: empId });
// export const removeEmployeeFromDepartment = (deptId, empId) => axiosInstance.post(`departments/${deptId}/remove_employee/`, { employee_id: empId });    

