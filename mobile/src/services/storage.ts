import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'userToken';
const SERVER_URL_KEY = 'serverUrl';

const isWeb = Platform.OS === 'web';

export const Storage = {
  saveToken: async (token: string) => {
    if (isWeb) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  },
  getToken: async () => {
    if (isWeb) {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
  },
  deleteToken: async () => {
    if (isWeb) {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  },
  saveServerUrl: async (url: string) => {
    if (isWeb) {
      localStorage.setItem(SERVER_URL_KEY, url);
    } else {
      await SecureStore.setItemAsync(SERVER_URL_KEY, url);
    }
  },
  getServerUrl: async () => {
    if (isWeb) {
      return localStorage.getItem(SERVER_URL_KEY);
    } else {
      return await SecureStore.getItemAsync(SERVER_URL_KEY);
    }
  },
};

