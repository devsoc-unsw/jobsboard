import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiToken: undefined,
  },
  getters: {
  },
  mutations: {
    setApiToken(state, newToken) {
      state.apiToken = newToken;
    },
    clearApiToken(state) {
      state.apiToken = undefined;
    },
  },
  actions: {
    setApiToken(context, newToken) {
      context.commit("setApiToken", newToken);
    },
    clearApiToken(context) {
      context.commit("setApiToken", undefined);
    },
  },
});
