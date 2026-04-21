import axios from 'axios';
import { clearToken, getToken } from '../lib/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

let unauthorizedHandler = null;

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function normalizeError(error) {
  const status = error?.response?.status || 500;
  const fallbackMessage = 'Terjadi kesalahan pada server. Coba lagi.';
  const serverMessage =
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    null;

  switch (status) {
    case 400:
      return new ApiError(400, serverMessage || 'Input atau query tidak valid.', error?.response?.data);
    case 401:
      return new ApiError(401, serverMessage || 'Sesi berakhir. Silakan login kembali.', error?.response?.data);
    case 404:
      return new ApiError(404, serverMessage || 'Data tidak ditemukan.', error?.response?.data);
    case 429:
      return new ApiError(429, serverMessage || 'Terlalu banyak request. Coba lagi sebentar.', error?.response?.data);
    default:
      return new ApiError(status, serverMessage || fallbackMessage, error?.response?.data);
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeError(error);

    if (normalizedError.status === 401) {
      clearToken();
      if (typeof unauthorizedHandler === 'function') {
        unauthorizedHandler(normalizedError);
      }
    }

    return Promise.reject(normalizedError);
  }
);

export default api;