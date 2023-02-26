import { ref } from 'vue';
import { defineStore } from 'pinia';
import config from '@/config/config';

export const useApiTokenStore = defineStore('apiToken', () => {
  const state = ref({
    apiToken: '',
  });

  function setApiToken(newToken: string) {
    state.value.apiToken = newToken;
    sessionStorage.setItem(config.sessionStorageApiTokenKeyName, newToken);
  }

  function clearApiToken() {
    state.value.apiToken = '';
    sessionStorage.removeItem(config.sessionStorageApiTokenKeyName);
  }

  function getApiToken() {
    const stateToken = state.value.apiToken;
    if (!stateToken) {
      const sessionStorageToken =
        sessionStorage.getItem(config.sessionStorageApiTokenKeyName);
      return sessionStorageToken ?? '';
    }
    return stateToken;
  }

  return { setApiToken, clearApiToken, getApiToken };
});
