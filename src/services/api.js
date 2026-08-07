import axios from 'axios';
import { clearLoggedIn } from '../lib/auth';
import i18n from '../i18n';

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

/**
 * True when a request failed because the backend itself is unhealthy or
 * unreachable — 500/502/503/504 and network errors alike (normalizeError gives
 * a response-less failure status 500). Public pages use this to fall back to
 * static placeholder content instead of rendering an empty section.
 */
export function isServerDown(error) {
  return typeof error?.status === 'number' && error.status >= 500;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  // KEAMANAN: token auth dikirim lewat cookie httpOnly, bukan header Authorization yang
  // di-set manual dari JS. withCredentials memastikan browser menyertakan cookie tsb
  // pada setiap request (backend CORS sudah diset AllowCredentials: true untuk ini).
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.language || 'id';
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeError(error);

    if (normalizedError.status === 401) {
      clearLoggedIn();
      if (typeof unauthorizedHandler === 'function') {
        unauthorizedHandler(normalizedError);
      }
    }

    return Promise.reject(normalizedError);
  }
);

export default api;