import store from '../store';

export default {
  alertComponentGuard: (to, from, next) => {
    if (store.getters.alertComponent) {
      store.dispatch('clearAlertComponent');
    }
    next();
  },
  /* alreadyAuthenticatedGuard: (to, from, next) => {
    if (store.getters.user) {
      next(false);
    }
    next();
  }, */
  authenticatedGuard: (to, from, next) => {
    if (store.getters.user) {
      next();
    } else {
      next('/');
    }
  },
};
