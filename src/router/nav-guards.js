import store from '../store';

export default {
  authenticationGuard: (to, from, next) => {
    if (store.getters.user) {
      next();
    } else {
      const authToken = localStorage.getItem('auth_token');
      if (authToken) {
        store.dispatch('autoSignIn', JSON.parse(authToken))
          .then(() => {
            if (!store.getters.error) {
              next();
            } else {
              next('/');
            }
          })
          .catch(() => {
            store.dispatch('setErrorAfterApiConsumption');
            next('/');
          });
      } else if (to.matched.some(record => record.meta.authRequired)) {
        next('/');
      } else { // auth not required
        next();
      }
    }
  },
  alertComponentGuard: (to, from, next) => {
    if (store.getters.alertComponent) {
      store.dispatch('clearAlertComponent');
    }
    next();
  },
};
