import Vue from 'vue';
import Router from 'vue-router';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import AdminDashboard from '@/components/Admin/Dashboard';
import AdminSearch from '@/components/Admin/Search';
import AdminTalents from '@/components/Admin/DataManagement/Master/Talents';
import AdminTalent from '@/components/Admin/DataManagement/Master/Talent';
import AdminCompanyMaturityLevelDataManagement from '@/components/Admin/DataManagement/ReferenceData/CompanyMaturityLevelDataManagement';
import EmployerDashboard from '@/components/Employer/Dashboard';
import EmployerProfile from '@/components/Employer/Profile';
import EmployerRequirements from '@/components/Employer/Requirements';
import EmployerRequirement from '@/components/Employer/Requirements/Requirement';
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
        if (store.getters.isUserAdmin) {
          next('/admin');
        } else if (store.getters.isUserEmployer) {
          next('/employer');
        } else {
          next('/talent/profile');
        }
      },
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
    },
    // ADMIN =======================================================================================
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: AdminDashboard,
      beforeEnter: NavGuards.authenticatedGuard,
    },
    {
      path: '/admin/search',
      name: 'AdminSearch',
      component: AdminSearch,
      beforeEnter: NavGuards.authenticatedGuard,
    },
    // Master data
    {
      path: '/admin/data-management/master/talents',
      name: 'AdminTalents',
      component: AdminTalents,
      beforeEnter: NavGuards.authenticatedGuard,
    },
    {
      path: '/admin/data-management/master/talents/:id',
      name: 'AdminTalent',
      component: AdminTalent,
      props: true,
    },
    // Reference data
    {
      path: '/admin/data-management/reference/company-maturity-levels',
      name: 'AdminCompanyMaturityLevelDataManagement',
      component: AdminCompanyMaturityLevelDataManagement,
      beforeEnter: NavGuards.authenticatedGuard,
    },
    // EMPLOYER ====================================================================================
    {
      path: '/employer',
      name: 'EmployerDashboard',
      component: EmployerDashboard,
      beforeEnter: NavGuards.authenticatedGuard,
    },
    {
      path: '/employer/profile',
      name: 'EmployerProfile',
      component: EmployerProfile,
      beforeEnter: NavGuards.authenticatedGuard,
    },
    {
      path: '/employer/requirements',
      name: 'EmployerRequirements',
      component: EmployerRequirements,
      beforeEnter: NavGuards.authenticatedGuard,
    },
    {
      path: '/employer/requirements/new',
      name: 'EmployerRequirement',
      component: EmployerRequirement,
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
