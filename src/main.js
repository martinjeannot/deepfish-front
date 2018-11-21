// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import linkify from 'vue-linkify';
import moment from 'moment';
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';
import VueAnalytics from 'vue-analytics';
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';

import App from './App';
import router from './router';
import store from './store';
import httpInterceptorsInit from './store/httpInterceptors';
import filters from './filters';

import BaseAlert from './components/Utilities/BaseAlert';
import TernaryCheckbox from './components/Utilities/TernaryCheckbox';
import DoughnutChart from './components/Utilities/Charts/DoughnutChart';
import LineChart from './components/Utilities/Charts/LineChart';
import UploadZone from './components/Utilities/UploadZone';

import './assets/stylus/main.styl';

// Localization
moment.locale(navigator.language || navigator.userLanguage);

// Enable/disable production configuration
const isProduction = process.env.NODE_ENV === 'production';

Vue.config.productionTip = !isProduction;

Vue.use(Vuetify);
Vue.use(filters);
Vue.use(VueAnalytics, {
  id: ['UA-90375031-1', 'UA-118984586-1'],
  router,
  debug: {
    // enabled: !isProduction,
    sendHitTask: isProduction,
  },
});

Vue.component('base-alert', BaseAlert);
Vue.component('ternary-checkbox', TernaryCheckbox);
Vue.component('doughnut-chart', DoughnutChart);
Vue.component('line-chart', LineChart);
Vue.component('vue-dropzone', vue2Dropzone);
Vue.component('upload-zone', UploadZone);

Vue.directive('linkified', linkify);

// cannot be done in Vue beforeCreate/created hooks because routing is already done then
httpInterceptorsInit();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
