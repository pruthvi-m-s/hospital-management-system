import API from "../api/axios";

export const getAll = () => API.get("/patients");
export const createData = (data) => API.post("/patients", data);
export const updatePatient = (id, data) => API.put(`/patients/${id}`, data);
export const deletePatient = (id) => API.delete(`/patients/${id}`);
