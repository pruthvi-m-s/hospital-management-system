import API from "../api/axios";

export const getLabReports = () => API.get("/lab-reports");
export const createLabReport = (data) => API.post("/lab-reports", data);
export const updateLabReport = (id, data) => API.put(`/lab-reports/${id}`, data);
export const deleteLabReport = (id) => API.delete(`/lab-reports/${id}`);
