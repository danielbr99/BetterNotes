import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'userToken';
const SERVER_URL_KEY = 'serverUrl';

export const Storage = {
  saveToken: async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  getToken: async () => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },
  deleteToken: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
  saveServerUrl: async (url: string) => {
    await SecureStore.setItemAsync(SERVER_URL_KEY, url);
  },
  getServerUrl: async () => {
    return await SecureStore.getItemAsync(SERVER_URL_KEY);
  },
};
