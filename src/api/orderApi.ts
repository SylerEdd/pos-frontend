import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
});

export const getOrdersByTab = (tabId: number) =>
  api.get(`/orders/tab/${tabId}`);

export const getAllOrders = () => api.get("/orders");
