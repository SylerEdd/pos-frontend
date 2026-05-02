import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
});

export const getAllTabs = () => api.get("/tabs");

export const getTabById = (id: number) => api.get(`/tabs/${id}`);

export const createTab = (tableNumber: string) =>
  api.post("/tabs", { tableNumber });

export const updateTabStatus = (id: number, tableStatus: string) =>
  api.patch(`/tabs/${id}/status`, { tableStatus });

export const deleteTabById = (id: number) => api.delete(`/tabs/${id}`);
