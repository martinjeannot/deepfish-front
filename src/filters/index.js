import moment from 'moment';

export default {
  install(Vue) {
    Vue.filter('formatDate', (value, format) => {
      if (!value) return '';
      return moment(value).format(format);
    });
    Vue.filter('formatMonetaryAmount', (value) => {
      const monetaryAmount = value || 0;
      return monetaryAmount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    });
  },
};
