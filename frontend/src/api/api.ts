// src/api/api.ts
import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const backendMessage =
        (error.response?.data as any)?.message ||
        (error.response?.data as any)?.error ||
        error.message;

        return Promise.reject({
        status: error.response?.status,
        message: backendMessage,
        raw: error,
        });
    }
);

export default api;
