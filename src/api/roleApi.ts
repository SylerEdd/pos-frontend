import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
});

export const getAllRoles = () => api.get("/roles");

export const createRole = (data: { name: string }) => api.post("/roles", data);

export const deleteRoleById = (id: number) => api.delete(`/roles/${id}`);
