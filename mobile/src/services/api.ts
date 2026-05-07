import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Default to the computer's local IP for network access from physical devices
const DEFAULT_BASE_URL = 'http://192.168.64.71:8000';

export const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject the JWT token from SecureStore
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to update the base URL dynamically
export const setApiBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
};
