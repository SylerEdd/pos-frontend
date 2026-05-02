import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
});

export const getAllUsers = () => api.get("/users");

export const getUserById = (id: number) => api.get(`/users/${id}`);

export const createUser = (data: {
  fullName: string;
  username: string;
  email: string;
  password: string;
  roles: number[];
}) => api.post("/users", data);

export const updateUser = (
  id: number,
  data: {
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
    roles?: number[];
  },
) => api.patch(`/users/${id}`, data);

export const deleteUserById = (id: number) => api.delete(`/users/${id}`);
