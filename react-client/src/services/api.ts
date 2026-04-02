import axios from 'axios';
import { environment } from '../config/environment';

const api = axios.create({
  baseURL: environment.apiUrl,
  withCredentials: true,
});

let currentToken: string | null = null;
let loadingCount = 0;

const shouldSkipLoading = (url?: string) =>
  url?.includes('refresh-token') || url?.includes('likes/list');

const setLoading = (loading: boolean) => {
  if (loading) {
    loadingCount++;
  } else {
    loadingCount = Math.max(0, loadingCount - 1);
  }
  const event = new CustomEvent('loadingChange', { detail: loadingCount > 0 });
  window.dispatchEvent(event);
};

export const setAuthToken = (token: string | null) => {
  currentToken = token;
};

api.interceptors.request.use(config => {
  if (!shouldSkipLoading(config.url)) setLoading(true);
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

api.interceptors.response.use(
  response => {
    if (!shouldSkipLoading(response.config.url)) setLoading(false);
    return response;
  },
  error => {
    if (!shouldSkipLoading(error.config?.url)) setLoading(false);

    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          if (data.errors) {
            const modelStateErrors = Object.values(data.errors).flat();
            throw modelStateErrors;
          }
          break;
        case 401:
          break;
        case 404:
          window.location.href = '/not-found';
          break;
        case 500:
          sessionStorage.setItem('serverError', JSON.stringify(data));
          window.location.href = '/server-error';
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;