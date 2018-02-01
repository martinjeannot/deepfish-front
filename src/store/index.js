import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import * as types from './mutation-types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appCreated: false,
    api: axios.create({
      baseURL: 'http://localhost:8080',
    }),
    authToken: null,
    user: null,
    loading: false,
    error: null,
    alertComponent: null,
  },
  mutations: {
    [types.SET_APP_CREATED](state, appCreated) {
      state.appCreated = appCreated;
    },
    [types.SET_AUTH_TOKEN](state, authToken) {
      state.authToken = authToken;
      state.api.defaults.headers.common.Authorization = `Bearer ${authToken.access_token}`;
    },
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
    setAppCreated({ commit }) {
      commit(types.SET_APP_CREATED, true);
    },
    clearLoading({ commit }) {
      commit(types.SET_LOADING, false);
    },
    setError({ commit }, error) {
      const errorObject = error || { message: 'Une erreur est survenue :(' };
      commit(types.SET_ERROR, errorObject);
      commit(types.SET_ALERT_COMPONENT, { type: 'error', message: errorObject.message });
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
    prepareForApiConsumption({ commit }) {
      commit(types.CLEAR_ERROR);
      commit(types.SET_LOADING, true);
    },
    setErrorAfterApiConsumption({ commit, dispatch }, error) {
      commit(types.SET_LOADING, false);
      dispatch('setError', error);
    },
    onAlertComponentDismissed({ dispatch }) {
      dispatch('clearError');
    },
    signUp({ commit, dispatch }, signUpForm) {
      commit(types.CLEAR_ERROR);
      commit(types.SET_LOADING, true);
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
    autoSignIn({ commit, dispatch, getters }, authToken) {
      commit(types.SET_AUTH_TOKEN, authToken);
      // get authenticated user
      const encodedAccessToken = authToken.access_token.split('.')[1].replace('-', '+').replace('_', '/');
      const accessToken = JSON.parse(window.atob(encodedAccessToken));
      let userUrl = null;
      if (accessToken.authorities.includes('ROLE_EMPLOYER')) {
        userUrl = `/employers/${accessToken.user_id}?projection=default`;
      } else {
        userUrl = `/talents/${accessToken.user_id}`;
      }
      dispatch('prepareForApiConsumption');
      return getters
        .api(userUrl)
        .then((response) => {
          commit(types.SET_USER, response.data);
        })
        .catch((/* error */) => {
          dispatch('setError', { message: 'Un problème est survenu lors de la connexion' });
        })
        .finally(() => dispatch('clearLoading'));
    },
    logout({ commit }) {
      localStorage.removeItem('auth_token');
      commit(types.SET_USER, null);
    },
  },
  getters: {
    appCreated(state) {
      return state.appCreated;
    },
    api(state) {
      return state.api;
    },
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
