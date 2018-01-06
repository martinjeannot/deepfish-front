import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import * as types from './mutation-types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authAxios: axios.create({
      baseURL: 'http://localhost:8080',
      auth: {
        username: '67e43464e9c0483faaf7b773018b2b60',
        password: '9c7d7778e0534031aa0ed684bba16546',
      },
    }),
    loading: false,
    error: null,
    user: null,
    alertComponent: null,
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
    [types.SET_USER](state, user) {
      state.user = user;
    },
    [types.SET_ALERT_COMPONENT](state, alertComponent) {
      state.alertComponent = alertComponent;
    },
    [types.CLEAR_ALERT_COMPONENT](state) {
      state.alertComponent = null;
    },
  },
  actions: {
    setError({ commit }, error) {
      commit(types.SET_ERROR, error);
      commit(types.SET_ALERT_COMPONENT, { type: 'error', message: error.message });
    },
    clearError({ commit }) {
      commit(types.CLEAR_ERROR);
      commit(types.CLEAR_ALERT_COMPONENT);
    },
    setAlertComponent({ commit }, alertComponent) {
      commit(types.SET_ALERT_COMPONENT, alertComponent);
    },
    clearAlertComponent({ commit }) {
      commit(types.CLEAR_ALERT_COMPONENT);
    },
    signUp({ commit, dispatch }, signUpForm) {
      commit(types.SET_LOADING, true);
      commit(types.CLEAR_ERROR);
      return axios
        .post('http://localhost:8080/employers/sign-up', signUpForm, {
          auth: { username: '67e43464e9c0483faaf7b773018b2b60', password: '9c7d7778e0534031aa0ed684bba16546' },
        })
        .then((/* response */) => {
          commit(types.SET_LOADING, false);
        })
        .catch((/* error */) => {
          commit(types.SET_LOADING, false);
          dispatch('setError', { message: 'Un problème est survenu lors de l\'inscription' });
        });
    },
    signIn({ commit, dispatch }, signInForm) {
      commit(types.SET_LOADING, true);
      commit(types.CLEAR_ERROR);
      // axios does not support x-www-form-urlencoded as content-type out of the box yet
      const payload = new URLSearchParams();
      payload.append('grant_type', 'password');
      payload.append('username', signInForm.email);
      payload.append('password', signInForm.password);
      axios.post('http://localhost:8080/oauth/token', payload, {
        auth: { username: '67e43464e9c0483faaf7b773018b2b60', password: '9c7d7778e0534031aa0ed684bba16546' },
      })
        .then((response) => {
          commit(types.SET_LOADING, false);
          const user = {
            authToken: response.data,
          };
          localStorage.setItem('auth_token', JSON.stringify(user.authToken));
          commit(types.SET_USER, user);
        })
        .catch((/* error */) => {
          commit(types.SET_LOADING, false);
          dispatch('setError', { message: 'Un problème est survenu lors de la connexion' });
        });
    },
    autoSignIn({ commit }, authToken) {
      const user = {
        authToken,
      };
      commit(types.SET_USER, user);
    },
    logout({ commit }) {
      localStorage.removeItem('auth_token');
      commit(types.SET_USER, null);
    },
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
    user(state) {
      return state.user;
    },
    alertComponent(state) {
      return state.alertComponent;
    },
  },
});
