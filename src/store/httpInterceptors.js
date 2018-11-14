import store from '.';
import router from '../router';

export default function () {
  store.getters.api.interceptors.response.use(
    response => response,
    (error) => {
      if (!error.response) {
        return Promise.reject(error);
      }
      const { config, response: { status, data } } = error;
      // in case of wrongly encoded token or other errors not expiration-related
      if (data.error === 'invalid_token' && !data.error_description.toLowerCase().includes('expired')) {
        return Promise.reject(error);
      }
      const originalRequest = config;

      if (status === 401 && !originalRequest.retry) {
        originalRequest.retry = true;
        if (store.getters.authTokenRefreshing) {
          return new Promise((resolve/* , reject */) => {
            store.getters.authTokenRefreshSubscribers.push(
              (authToken) => {
                originalRequest.headers.Authorization = `Bearer ${authToken.access_token}`;
                return resolve(store.getters.api(originalRequest));
              });
          });
        }
        store.dispatch('setAuthTokenRefreshing', true);
        const payload = {
          grant_type: 'refresh_token',
          refresh_token: store.getters.refreshToken,
        };
        store.dispatch('clearAuthToken'); // to prevent infinite looping with previous invalid token
        return store.dispatch('requestAccessToken', payload)
          .then((response) => {
            localStorage.setItem('auth_token', JSON.stringify(response.data));
            store.dispatch('setAuthToken', response.data);
            store.dispatch('setAuthTokenRefreshing', false);
            store.getters.authTokenRefreshSubscribers
              .forEach(callback => callback(response.data));
            store.getters.authTokenRefreshSubscribers.length = 0;
            originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
            return store.getters.api(originalRequest);
          })
          .catch(() => {
            store.dispatch('logout');
            router.push('/');
            store.dispatch('setAlertComponent', { type: 'error', message: 'Your session has expired' });
          });
      }
      return Promise.reject(error);
    });
}
