// src/api/api.ts
import axios, { AxiosError } from "axios";

// Server-side (SSR/Docker): use internal API_URL so Next.js can reach the backend container.
// Client-side (browser): use NEXT_PUBLIC_API_URL which resolves to localhost.
const baseURL = typeof window === 'undefined'
    ? (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '')
    : (process.env.NEXT_PUBLIC_API_URL || '');

const api = axios.create({
    baseURL,
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
