import Vuex from "vuex";
import Vue from "vue";

import config from "@/config/config";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiToken: undefined,
  },
  getters: {
    getApiToken(state) {
      const stateToken = state.apiToken;
      if (stateToken === undefined) {
        const sessionStorageToken = sessionStorage.getItem(config.sessionStorageApiTokenKeyName);
        if (sessionStorageToken === undefined) {
          return undefined;
        }
        return sessionStorageToken;
      }
      return stateToken;
    },
  },
  mutations: {
    setApiToken(state, newToken) {
      state.apiToken = newToken;
      sessionStorage.setItem(config.sessionStorageApiTokenKeyName, newToken);
    },
    clearApiToken(state) {
      state.apiToken = undefined;
      sessionStorage.removeItem(config.sessionStorageApiTokenKeyName);
    },
  },
  actions: {
    setApiToken(context, newToken) {
      context.commit("setApiToken", newToken);
    },
    clearApiToken(context) {
      context.commit("setApiToken", undefined);
      sessionStorage.removeItem(config.sessionStorageApiTokenKeyName);
    },
  },
});
