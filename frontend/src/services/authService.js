import axios from "axios";

const AUTH_API = axios.create({
  baseURL: "http://localhost:8080/api/auth"
});

export const login = (username, password) =>
  AUTH_API.post("/login", { username, password });

export const register = (username, password, role) =>
  AUTH_API.post("/register", { username, password, role });
