import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import moment from 'moment';
import * as types from './mutation-types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appCreated: true, // still useful ?
    authToken: null,
    authTokenRefreshing: false,
    authTokenRefreshSubscribers: [],
    authProcessCompleted: false,
    user: null,
    api: axios.create({
      baseURL: process.env.DEEPFISH_BACK_BASE_URL,
    }),
    loading: false,
    initialLoading: false,
    menuBadges: {},
    snackbar: { show: false, text: '' },
    error: null,
    alertComponent: null,
    getTalentMaturityLevel(maturityLevel) {
      switch (maturityLevel) {
        case 'CLEAR_WATER':
          return 'Clear water';
        case 'OPEN_WATER':
          return 'Open water';
        case 'DEEP_WATER':
          return 'Deep water';
        default:
          return 'N/A';
      }
    },
    getOpportunityStatusColor(status) {
      switch (status) {
        case 'ACCEPTED':
          return 'green';
        case 'PENDING':
          return 'orange';
        case 'DECLINED':
          return 'red';
        default:
          return null;
      }
    },
    getLabelFromOpportunityStatus(opportunityStatus) {
      switch (opportunityStatus) {
        case 'ACCEPTED':
          return 'Ton profil a été accepté par le recruteur';
        case 'PENDING':
          return 'Ton profil est en attente du recruteur';
        case 'DECLINED':
          return 'Ton profil a été décliné par le recruteur';
        default:
          return 'Ton profil est en cours de validation par Deepfish';
      }
    },
    getTalentLinkedInProfileUrl(basicProfile) {
      if (basicProfile.publicProfileUrl) {
        return basicProfile.publicProfileUrl;
      } else if (basicProfile.siteStandardProfileRequest) {
        return basicProfile.siteStandardProfileRequest.url;
      }
      return null;
    },
    talentRankingReferenceData: [
      { text: '', value: 0 },
      { text: 'A', value: 1 },
      { text: 'B', value: 2 },
      { text: 'C', value: 3 },
    ],
  },
  mutations: {
    [types.SET_APP_CREATED](state, appCreated) {
      state.appCreated = appCreated;
    },
    [types.SET_AUTH_TOKEN](state, authToken) {
      state.authToken = authToken;
      if (authToken) {
        state.api.defaults.headers.common.Authorization = `Bearer ${authToken.access_token}`;
      } else {
        delete state.api.defaults.headers.common.Authorization;
      }
    },
    [types.SET_AUTH_TOKEN_REFRESHING](state, authTokenRefreshing) {
      state.authTokenRefreshing = authTokenRefreshing;
    },
    [types.SET_AUTH_PROCESS_COMPLETED](state, authProcessCompleted) {
      state.authProcessCompleted = authProcessCompleted;
    },
    [types.SET_USER](state, user) {
      state.user = user;
    },
    [types.SET_LOADING](state, status) {
      state.loading = status;
    },
    [types.SET_INITIAL_LOADING](state, status) {
      state.initialLoading = status;
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
    setAuthToken({ commit }, authToken) {
      commit(types.SET_AUTH_TOKEN, authToken);
    },
    clearAuthToken({ commit }) {
      commit(types.SET_AUTH_TOKEN, null);
    },
    setAuthTokenRefreshing({ commit }, authTokenRefreshing) {
      commit(types.SET_AUTH_TOKEN_REFRESHING, authTokenRefreshing);
    },
    prepareForApiConsumption({ commit }, initial = false) {
      commit(types.CLEAR_ERROR);
      if (initial) {
        commit(types.SET_INITIAL_LOADING, true);
      } else {
        commit(types.SET_LOADING, true);
      }
    },
    clearLoading({ commit }, initial = false) {
      if (initial) {
        commit(types.SET_INITIAL_LOADING, false);
      } else {
        commit(types.SET_LOADING, false);
      }
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
    saveTalent({ getters }, talent) {
      const talentCopy = Object.assign({}, talent);
      // linked refs deletion
      delete talentCopy.conditions;
      delete talentCopy.qualification;
      delete talentCopy.opportunities;
      // nested maps deletion (to avoid merging)
      delete talentCopy.basicProfile;
      return getters.api.patch(talent._links.self.href, talentCopy);
    },
    saveRequirementData({ getters }, requirement) {
      const requirementCopy = Object.assign({}, requirement);
      // linked refs deletion
      delete requirementCopy.company;
      delete requirementCopy.jobType;
      delete requirementCopy.seniority;
      // nested maps deletion (to avoid merging)
      delete requirementCopy.typeform;
      return getters.api.patch(requirement._links.self.href, requirementCopy);
    },
    requestAccessToken({ getters }, payload) {
      // https://github.com/axios/axios/issues/1195
      return getters.api.post('/oauth/token', payload, {
        auth: {
          username: '67e43464e9c0483faaf7b773018b2b60',
          password: '9c7d7778e0534031aa0ed684bba16546',
        },
        transformRequest: [
          function transformRequest(data) {
            const serializedData = [];
            Object.keys(data).forEach((key) => {
              if (data[key]) {
                serializedData.push(`${key}=${encodeURIComponent(data[key])}`);
              }
            });
            return serializedData.join('&');
          },
        ],
      });
    },
    signUp({ commit, dispatch }, signUpForm) {
      commit(types.CLEAR_ERROR);
      commit(types.SET_LOADING, true);
      return axios
        .post(`${process.env.DEEPFISH_BACK_BASE_URL}/employers/sign-up`, signUpForm, {
          auth: { username: '67e43464e9c0483faaf7b773018b2b60', password: '9c7d7778e0534031aa0ed684bba16546' },
        })
        .then((response) => {
          commit(types.SET_LOADING, false);
          return response;
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
      dispatch('prepareForApiConsumption');
      if (accessToken.authorities.includes('ROLE_ADMIN')) { // ADMIN
        return getters
          .api(`/users/${accessToken.user_id}`)
          .then((response) => {
            commit(types.SET_USER, response.data);
            return getters.api
              .patch(getters.user._links.self.href, { lastSignedInAt: moment().utc().format() });
          })
          .then(() => {
            commit(types.SET_AUTH_PROCESS_COMPLETED, true);
          })
          .catch((/* error */) => {
            dispatch('setError', { message: 'Un problème est survenu lors de la connexion' });
          })
          .finally(() => dispatch('clearLoading'));
      } else if (accessToken.authorities.includes('ROLE_EMPLOYER')) { // EMPLOYER
        return getters
          .api(`/employers/${accessToken.user_id}?projection=default`)
          .then((response) => {
            commit(types.SET_USER, response.data);
            // check for requirements for redirection and pending talents for menu badge
            return Promise.all([
              getters.api(`/requirements?company=${getters.user.company.id}`),
              getters.api(`/opportunities?projection=employer&requirement.company=${getters.user.company.id}&requirement.status=OPEN&employerStatus=PENDING`),
            ]);
          })
          .then(([
                   requirementsResponse,
                   opportunitiesResponse,
                 ]) => {
            /* eslint-disable no-param-reassign */
            getters.user.requirements = requirementsResponse.data._embedded.requirements;
            dispatch('setMenuBadges', { talents: opportunitiesResponse.data._embedded.opportunities.length });
            return getters.api
              .patch(getters.user._links.self.href, { lastSignedInAt: moment().utc().format() });
          })
          .then(() => {
            commit(types.SET_AUTH_PROCESS_COMPLETED, true);
          })
          .catch((/* error */) => {
            dispatch('setError', { message: 'Un problème est survenu lors de la connexion' });
          })
          .finally(() => dispatch('clearLoading'));
      }
      // TALENT
      return getters
        .api(`/talents/${accessToken.user_id}`)
        .then((response) => {
          commit(types.SET_USER, response.data);
          // get pending opportunities for menu badge
          return getters.api(`/opportunities?talent=${accessToken.user_id}&talentStatus=PENDING&requirement.status=OPEN`);
        })
        .then((pendingOpportunitiesResponse) => {
          dispatch('setMenuBadges', { opportunities: pendingOpportunitiesResponse.data._embedded.opportunities.length });
          return getters
            .api.patch(getters.user._links.self.href, { lastSignedInAt: moment().utc().format() });
        })
        .then(() => {
          commit(types.SET_AUTH_PROCESS_COMPLETED, true);
        })
        .catch((/* error */) => {
          dispatch('setError', { message: 'Un problème est survenu lors de la connexion' });
        })
        .finally(() => dispatch('clearLoading'));
    },
    logout({ commit, dispatch }) {
      localStorage.removeItem('auth_token');
      dispatch('clearAuthToken');
      commit(types.SET_AUTH_PROCESS_COMPLETED, false);
      commit(types.SET_USER, null);
    },
    signInAs({ dispatch, getters }, username) {
      dispatch('prepareForApiConsumption');
      getters.api
        .post(`${process.env.DEEPFISH_BACK_BASE_URL}/auth/sign-in-as`, { username })
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
    authTokenRefreshing(state) {
      return state.authTokenRefreshing;
    },
    authTokenRefreshSubscribers(state) {
      return state.authTokenRefreshSubscribers;
    },
    refreshToken(state) {
      if (state.authToken) {
        return state.authToken.refresh_token;
      }
      return null;
    },
    loading(state) {
      return state.loading;
    },
    initialLoading(state) {
      return state.initialLoading;
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
    linkedInAuthEndpoint() {
      const queryParams = {
        response_type: 'code',
        client_id: `${process.env.LINKEDIN_CLIENT_ID}`,
        redirect_uri: `${process.env.DEEPFISH_BACK_BASE_URL}/auth/linkedin/callback`,
        // eslint-disable-next-line no-bitwise
        state: ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c => (((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16)),
        scope: 'r_basicprofile r_emailaddress',
      };
      const queryString = Object.keys(queryParams).map(k => `${k}=${encodeURIComponent(queryParams[k])}`).join('&');
      return `https://www.linkedin.com/oauth/v2/authorization?${queryString}`;
    },
    user(state) {
      return state.user;
    },
    isUserAuthenticated(state, getters) {
      return state.authProcessCompleted && getters.user !== null && getters.user !== undefined;
    },
    isUserAdmin(state, getters) {
      return getters.isUserAuthenticated ? getters.user.authorities.some(authority => authority.authority === 'ROLE_ADMIN') : false;
    },
    isUserSuperAdmin(state, getters) {
      return getters.isUserAuthenticated ? getters.user.authorities.some(authority => authority.authority === 'ROLE_SUPER_ADMIN') : false;
    },
    isUserEmployer(state, getters) {
      return getters.isUserAuthenticated ? getters.user.authorities.some(authority => authority.authority === 'ROLE_EMPLOYER') : false;
    },
    isUserTalent(state, getters) {
      return getters.isUserAuthenticated ? getters.user.authorities.some(authority => authority.authority === 'ROLE_TALENT') : false;
    },
    // REFERENCE DATA
    talentRankingReferenceData(state) {
      return state.talentRankingReferenceData;
    },
  },
});
