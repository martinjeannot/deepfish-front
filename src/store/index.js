import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import * as types from './mutation-types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appCreated: false,
    authToken: null,
    user: null,
    api: axios.create({
      baseURL: 'http://localhost:8080',
    }),
    loading: false,
    menuBadges: {},
    snackbar: { show: false, text: '' },
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
    [types.SET_USER](state, user) {
      state.user = user;
    },
    [types.SET_LOADING](state, status) {
      state.loading = status;
    },
    [types.SET_MENU_BADGES](state, menuBadges) {
      state.menuBadges = menuBadges;
    },
    [types.SET_SNACKBAR](state, snackbar) {
      state.snackbar = snackbar;
    },
    [types.SET_ERROR](state, error) {
      state.error = error;
    },
    [types.CLEAR_ERROR](state) {
      state.error = null;
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
    prepareForApiConsumption({ commit }) {
      commit(types.CLEAR_ERROR);
      commit(types.SET_LOADING, true);
    },
    clearLoading({ commit }) {
      commit(types.SET_LOADING, false);
    },
    setMenuBadges({ commit }, menuBadges) {
      commit(types.SET_MENU_BADGES, menuBadges);
    },
    showSnackbar({ commit }, text) {
      commit(types.SET_SNACKBAR, { show: true, text });
    },
    showSuccessSnackbar({ dispatch }) {
      dispatch('showSnackbar', 'OK');
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
      if (accessToken.authorities.includes('ROLE_ADMIN')) {
        userUrl = `/users/${accessToken.user_id}`;
      } else if (accessToken.authorities.includes('ROLE_EMPLOYER')) {
        userUrl = `/employers/${accessToken.user_id}?projection=default`;
      } else {
        userUrl = `/talents/${accessToken.user_id}`;
      }
      dispatch('prepareForApiConsumption');
      return getters
        .api(userUrl)
        .then((response) => {
          commit(types.SET_USER, response.data);
          if (getters.isUserTalent) {
            // get pending opportunities for menu badge
            getters
              .api(`/opportunities?talent=${accessToken.user_id}&status=PENDING`)
              .then((pendingOpportunitiesResponse) => {
                dispatch('setMenuBadges', { opportunities: pendingOpportunitiesResponse.data._embedded.opportunities.length });
              });
          }
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
    signInAs({ dispatch, getters }, username) {
      dispatch('prepareForApiConsumption');
      getters.api
        .post('http://localhost:8080/auth/sign-in-as', { username })
        .then((response) => {
          dispatch('logout');
          localStorage.setItem('auth_token', JSON.stringify(response.data));
          location.href = location.origin;
        })
        .finally(() => dispatch('clearLoading'));
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
    menuBadges(state) {
      return state.menuBadges;
    },
    snackbar(state) {
      return state.snackbar;
    },
    error(state) {
      return state.error;
    },
    alertComponent(state) {
      return state.alertComponent;
    },
    user(state) {
      return state.user;
    },
    isUserAuthenticated(state, getters) {
      return getters.user !== null && getters.user !== undefined;
    },
    isUserAdmin(state, getters) {
      return getters.isUserAuthenticated ? getters.user.authorities.some(authority => authority.authority === 'ROLE_ADMIN') : false;
    },
    isUserEmployer(state, getters) {
      return getters.isUserAuthenticated ? getters.user.authorities.some(authority => authority.authority === 'ROLE_EMPLOYER') : false;
    },
    isUserTalent(state, getters) {
      return getters.isUserAuthenticated ? getters.user.authorities.some(authority => authority.authority === 'ROLE_TALENT') : false;
    },
  },
});
