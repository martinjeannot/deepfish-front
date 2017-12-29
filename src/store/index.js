import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import * as types from './mutation-types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    error: null,
    user: {
      id: '1',
    },
  },
  mutations: {
    [types.SET_LOADING](state, status) {
      state.loading = status;
    },
    [types.SET_ERROR](state, error) {
      state.error = error;
    },
    [types.CLEAR_ERROR](state) {
      state.error = null;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    clearError({ commit }) {
      commit(types.CLEAR_ERROR);
    },
    signUp({ commit }, signUpForm) {
      commit(types.SET_LOADING, true);
      commit(types.CLEAR_ERROR);
      axios
        .post('http://localhost:8080/employers/sign-up', signUpForm)
        .then((/* response */) => {
          commit(types.SET_LOADING, false);
        })
        .catch((/* error */) => {
          commit(types.SET_LOADING, false);
          commit(types.SET_ERROR, { message: 'Un problème est survenu lors de la connexion' });
        });
    },
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
  },
});
