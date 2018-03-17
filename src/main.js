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
import StarRating from './components/Utilities/StarRating';
import TernaryCheckbox from './components/Utilities/TernaryCheckbox';

Vue.use(Vuetify);
Vue.use(filters);

Vue.config.productionTip = false;

Vue.component('base-alert', BaseAlert);
Vue.component('star-rating', StarRating);
Vue.component('ternary-checkbox', TernaryCheckbox);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
