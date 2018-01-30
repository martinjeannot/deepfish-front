import Vue from 'vue';
import Router from 'vue-router';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import EmployerDashboard from '@/components/Employer/Dashboard';
import EmployerRequirements from '@/components/Employer/Requirements';
import TalentProfile from '@/components/Talent/Profile';
import TalentConditions from '@/components/Talent/Conditions';
import store from '../store';
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
      path: '/authentication-success-handler',
      name: 'AuthenticationSuccessHandler',
      beforeEnter: (to, from, next) => {
        if (store.getters.user.authorities.some(authority => authority.authority === 'ROLE_TALENT')) {
          next('/talent/profile');
        } else {
          next('/employer');
        }
      },
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
    },
    // EMPLOYER ====================================================================================
    {
      path: '/employer',
      name: 'EmployerDashboard',
      component: EmployerDashboard,
      beforeEnter: NavGuards.authenticatedGuard,
    },
    {
      path: '/employer/requirements',
      name: 'EmployerRequirements',
      component: EmployerRequirements,
      beforeEnter: NavGuards.authenticatedGuard,
    },
    // TALENT ======================================================================================
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
      path: '/talent/profile',
      name: 'TalentProfile',
      component: TalentProfile,
    },
    {
      path: '/talent/conditions',
      name: 'TalentConditions',
      component: TalentConditions,
    },
  ],
});

router.beforeEach(NavGuards.alertComponentGuard);

export default router;
