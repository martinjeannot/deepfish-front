// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';
import VueAnalytics from 'vue-analytics';
import Modernizr from 'modernizr';

import App from './App';
import router from './router';
import store from './store';
import filters from './filters';

import BaseAlert from './components/Utilities/BaseAlert';
import StarRating from './components/Utilities/StarRating';
import TernaryCheckbox from './components/Utilities/TernaryCheckbox';

Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(filters);
Vue.use(VueAnalytics, {
  id: ['UA-90375031-1', 'UA-118984586-1'],
  router,
});

Vue.component('base-alert', BaseAlert);
Vue.component('star-rating', StarRating);
Vue.component('ternary-checkbox', TernaryCheckbox);

if (!Modernizr.urlsearchparams) {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    template: '<div id="app" style="text-align: center; padding-top: 5rem"><h2>Votre navigateur n\'est pas à jour</h2><br/><h3>Deepfish supporte Chrome, Firefox et Edge 17+</h3></div>',
  });
} else {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
    created() {
      this.$store.getters.api.interceptors.response.use(
        response => response,
        (error) => {
          const { config, response: { status } } = error;
          const originalRequest = config;

          if (status === 401 && !originalRequest.retry) {
            originalRequest.retry = true;
            if (this.$store.getters.authTokenRefreshing) {
              return new Promise((resolve/* , reject */) => {
                this.$store.getters.authTokenRefreshSubscribers.push(
                  (authToken) => {
                    originalRequest.headers.Authorization = `Bearer ${authToken.access_token}`;
                    return resolve(this.$store.getters.api(originalRequest));
                  });
              });
            }
            this.$store.dispatch('setAuthTokenRefreshing', true);
            const payload = new URLSearchParams();
            payload.append('grant_type', 'refresh_token');
            payload.append('refresh_token', this.$store.getters.refreshToken);
            this.$store.dispatch('clearAuthToken'); // to prevent infinite looping with previous invalid token
            return this.$store.getters.api
              .post('/oauth/token', payload, {
                auth: { username: '67e43464e9c0483faaf7b773018b2b60', password: '9c7d7778e0534031aa0ed684bba16546' },
              })
              .then((response) => {
                localStorage.setItem('auth_token', JSON.stringify(response.data));
                this.$store.dispatch('setAuthToken', response.data);
                this.$store.dispatch('setAuthTokenRefreshing', false);
                this.$store.getters.authTokenRefreshSubscribers
                  .forEach(callback => callback(response.data));
                this.$store.getters.authTokenRefreshSubscribers.length = 0;
                originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                return this.$store.getters.api(originalRequest);
              })
              .catch(() => {
                this.$store.dispatch('logout');
                this.$router.push('/');
                this.$store.dispatch('setAlertComponent', { type: 'error', message: 'Your session has expired' });
              });
          }
          return Promise.reject(error);
        });
    },
  });
}
