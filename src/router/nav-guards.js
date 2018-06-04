import store from '../store';

export default {
  authenticationGuard: (to, from, next) => {
    if (store.getters.user) {
      next();
    } else {
      let authToken = localStorage.getItem('auth_token');
      if (authToken) {
        // trailing slash removal
        if (authToken.endsWith('/')) {
          authToken = authToken.substring(0, authToken.length - 1);
        }
        store.dispatch('autoSignIn', JSON.parse(authToken))
          .then(() => {
            if (!store.getters.error) {
              next();
            } else {
              localStorage.removeItem('auth_token'); // clean up eventual token to break auth guard loop
              next('/');
            }
          })
          .catch(() => {
            store.dispatch('setErrorAfterApiConsumption');
            localStorage.removeItem('auth_token'); // clean up eventual token to break auth guard loop
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
