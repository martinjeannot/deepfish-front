// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';

import App from './App';
import router from './router';
import store from './store';
import filters from './filters';

import BaseAlert from './components/Utilities/BaseAlert';

Vue.use(Vuetify);
Vue.use(filters);

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
      try {
        this.$store.dispatch('autoSignIn', JSON.parse(authToken))
          .then(() => {
            this.$store.dispatch('setAppCreated', true);
            if (!this.$store.getters.error) {
              this.$router.push('/auth/success');
            } else {
              this.$router.push('/');
            }
          });
      } catch (error) {
        this.$store.dispatch('setAppCreated', true);
        this.$store.dispatch('setErrorAfterApiConsumption');
        this.$router.push('/');
      }
    } else {
      this.$store.dispatch('setAppCreated', true);
      this.$router.push('/');
    }
  },
});
