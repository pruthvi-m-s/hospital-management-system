import API from "../api/axios";

export const getBills = () => API.get("/bills");
export const createBill = (data) => API.post("/bills", data);
export const updateBill = (id, data) => API.put(`/bills/${id}`, data);
export const deleteBill = (id) => API.delete(`/bills/${id}`);
