import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api"
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("hms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear token and redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hms_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
