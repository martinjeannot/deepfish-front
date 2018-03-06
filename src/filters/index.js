import moment from 'moment';

export default {
  install(Vue) {
    Vue.filter('formatDate', (value, format) => {
      if (!value) return '';
      return moment(value).format(format);
    });
  },
};
