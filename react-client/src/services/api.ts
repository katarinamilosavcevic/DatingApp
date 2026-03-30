import axios from 'axios';
import { environment } from '../config/environment';

const api = axios.create({
  baseURL: environment.apiUrl,
  withCredentials: true,
});

let currentToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  currentToken = token;
};

api.interceptors.request.use(config => {
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

export default api;