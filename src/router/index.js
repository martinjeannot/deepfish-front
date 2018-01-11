import Vue from 'vue';
import Router from 'vue-router';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import Dashboard from '@/components/Employer/Dashboard';
import NavGuards from './nav-guards';

Vue.use(Router);

// According to the RFC 3986 (https://tools.ietf.org/html/rfc3986#section-3) a fragment identifier
// (i.e anchor tag) only appear after query params. Vue Router does not take this into account hence
// any redirection with params leads to an empty to.query object (instead of populated query params)
// We should look out for any potential alternative to window.location parsing
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'SignIn',
      component: SignIn,
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/employer',
      name: 'EmployerDashboard',
      component: Dashboard,
      beforeEnter: NavGuards.authenticatedGuard,
    },
    {
      path: '/talent/auth-callback',
      name: 'TalentAuthCallback',
      beforeEnter: (to, from, next) => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.has('auth_token')) {
          localStorage.setItem('auth_token', queryParams.get('auth_token'));
          location.href = location.origin;
        } else {
          next('/');
        }
      },
    },
    {
      path: '/talent',
      name: 'TalentDashboard',
      component: Dashboard,
      beforeEnter: NavGuards.authenticatedGuard,
    },
  ],
});

router.beforeEach(NavGuards.alertComponentGuard);

export default router;
