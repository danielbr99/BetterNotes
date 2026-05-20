import axios from 'axios';
import { Storage } from './storage';

import { Platform } from 'react-native';

const API_URL = Platform.select({
  android: 'http://10.0.2.2:8000', // IP para emulador
  ios: 'http://localhost:8000',
  web: 'http://localhost:8000',
  default: 'http://192.168.65.52:8000', // Tu IP local para móvil físico
});

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject the JWT token from Storage
api.interceptors.request.use(async (config) => {
  const token = await Storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to update the base URL dynamically
export const setApiBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
};
