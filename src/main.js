// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';

import App from './App';
import router from './router';
import store from './store';

import BaseAlert from './components/Utilities/BaseAlert';

Vue.use(Vuetify);

Vue.config.productionTip = false;

Vue.component('base-alert', BaseAlert);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created() {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      this.$store.dispatch('autoSignIn', JSON.parse(authToken));
    }
  },
});
