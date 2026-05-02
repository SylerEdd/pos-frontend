import axios from "axios";

// This file contains all API calls related to authentication, such as login, logout, and fetching the current user.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
});

// API functions
export const loginUser = (username: string, password: string) =>
  api.post("/auth/login", { username, password });

export const quickLogin = (userId: number) =>
  api.post("/auth/quick-login", { userId });

export const logoutUser = () => api.post("/auth/logout");

export const getMe = () => api.get("/auth/me");
