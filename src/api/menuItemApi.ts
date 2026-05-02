import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
});

export const getAllMenuItems = () => api.get("/menu-items");

export const getMenuItemById = (id: number) => api.get(`/menu-items/${id}`);

export const createMenuItem = (name: string, price: number, section: string) =>
  api.post("/menu-items", { name, price, section });

export const updateMenuItem = (
  id: number,
  data: { name?: string; price?: number },
) => api.put(`/menu-items/${id}`, data);

export const deleteMenuItemById = (id: number) =>
  api.delete(`/menu-items/${id}`);
