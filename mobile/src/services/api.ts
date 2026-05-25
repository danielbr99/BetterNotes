import axios from 'axios';
import { Storage } from './storage';

import { Platform } from 'react-native';

const API_URL = Platform.select({
  android: 'http://10.0.2.2:4010', // IP para emulador
  ios: 'http://localhost:4010',
  web: 'http://localhost:4010',
  default: 'http://192.168.65.52:4010', // Tu IP local para móvil físico
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

// Interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      await Storage.deleteToken();
      // We can't easily trigger a logout from here without a circular dependency, 
      // but clearing the token will force the app to the login screen on next check or reload.
      // Most Expo Router apps handle this via a listener or by checking isAuthenticated.
      if (Platform.OS === 'web') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper to update the base URL dynamically
export const setApiBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
};
