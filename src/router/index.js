import Vue from 'vue';
import Router from 'vue-router';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import AdminDashboard from '@/components/Admin/Dashboard';
import AdminProfile from '@/components/Admin/Profile';
import AdminSearch from '@/components/Admin/Search';
import AdminDMTalents from '@/components/Admin/DataManagement/Master/Talents';
import AdminDMTalent from '@/components/Admin/DataManagement/Master/Talent';
import AdminDMEmployers from '@/components/Admin/DataManagement/Master/Employers';
import AdminDMEmployer from '@/components/Admin/DataManagement/Master/Employer';
import AdminDMCompanies from '@/components/Admin/DataManagement/Master/Companies';
import AdminDMCompany from '@/components/Admin/DataManagement/Master/Company';
import AdminDMRequirements from '@/components/Admin/DataManagement/Master/Requirements';
import AdminDMRequirement from '@/components/Admin/DataManagement/Master/Requirement';
import AdminDMOpportunities from '@/components/Admin/DataManagement/Master/Opportunities';
import AdminDMOpportunity from '@/components/Admin/DataManagement/Master/Opportunity';
import AdminDMUsers from '@/components/Admin/DataManagement/Master/Users';
import AdminDMNewUser from '@/components/Admin/DataManagement/Master/NewUser';
import AdminCompanyMaturityLevelDataManagement from '@/components/Admin/DataManagement/ReferenceData/CompanyMaturityLevelDataManagement';
import EmployerDashboard from '@/components/Employer/Dashboard';
import EmployerProfile from '@/components/Employer/Profile';
import EmployerRequirements from '@/components/Employer/Requirements';
import EmployerRequirement from '@/components/Employer/Requirements/Requirement';
import EmployerTalents from '@/components/Employer/Talents/Talents';
import TalentProfile from '@/components/Talent/Profile';
import TalentConditions from '@/components/Talent/Conditions';
import TalentOpportunities from '@/components/Talent/Opportunity/Opportunities';
import TalentOpportunity from '@/components/Talent/Opportunity/Opportunity';
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
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      redirect: { name: 'SignIn' },
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignIn,
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/auth/callback',
      name: 'AuthCallback',
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
      path: '/auth/success',
      name: 'AuthSuccessHandler',
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
    // ADMIN =======================================================================================
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: AdminDashboard,
      meta: { authRequired: true },
    },
    {
      path: '/admin/profile',
      name: 'AdminProfile',
      component: AdminProfile,

      meta: { authRequired: true },
    },
    {
      path: '/admin/search',
      name: 'AdminSearch',
      component: AdminSearch,
      meta: { authRequired: true },
    },
    // Master data
    {
      path: '/admin/data-management/master/talents',
      name: 'AdminDMTalents',
      component: AdminDMTalents,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/master/talents/:id',
      name: 'AdminDMTalent',
      component: AdminDMTalent,
      props: true,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/master/employers',
      name: 'AdminDMEmployers',
      component: AdminDMEmployers,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/master/employers/:id',
      name: 'AdminDMEmployer',
      component: AdminDMEmployer,
      props: true,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/master/companies',
      name: 'AdminDMCompanies',
      component: AdminDMCompanies,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/master/companies/:id',
      name: 'AdminDMCompany',
      component: AdminDMCompany,
      props: true,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/master/requirements',
      name: 'AdminDMRequirements',
      component: AdminDMRequirements,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/master/requirements/:id',
      name: 'AdminDMRequirement',
      component: AdminDMRequirement,
      props: true,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/master/opportunities',
      name: 'AdminDMOpportunities',
      component: AdminDMOpportunities,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/master/opportunities/:id',
      name: 'AdminDMOpportunity',
      component: AdminDMOpportunity,
      props: true,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/master/users',
      name: 'AdminDMUsers',
      component: AdminDMUsers,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/master/new-user',
      name: 'AdminDMNewUser',
      component: AdminDMNewUser,
      meta: { authRequired: true },
    },
    // Reference data
    {
      path: '/admin/data-management/reference/company-maturity-levels',
      name: 'AdminCompanyMaturityLevelDataManagement',
      component: AdminCompanyMaturityLevelDataManagement,
      meta: { authRequired: true },
    },
    // EMPLOYER ====================================================================================
    {
      path: '/employer',
      name: 'EmployerDashboard',
      component: EmployerDashboard,
      meta: { authRequired: true },
    },
    {
      path: '/employer/profile',
      name: 'EmployerProfile',
      component: EmployerProfile,
      meta: { authRequired: true },
    },
    {
      path: '/employer/requirements',
      name: 'EmployerRequirements',
      component: EmployerRequirements,
      meta: { authRequired: true },
    },
    {
      path: '/employer/requirements/new',
      name: 'EmployerRequirement',
      component: EmployerRequirement,
      meta: { authRequired: true },
    },
    {
      path: '/employer/talents',
      name: 'EmployerTalents',
      component: EmployerTalents,
      meta: { authRequired: true },
    },
    // TALENT ======================================================================================
    {
      path: '/talent/profile',
      name: 'TalentProfile',
      component: TalentProfile,
      meta: { authRequired: true },
    },
    {
      path: '/talent/conditions',
      name: 'TalentConditions',
      component: TalentConditions,
      meta: { authRequired: true },
    },
    {
      path: '/talent/opportunities',
      name: 'TalentOpportunities',
      component: TalentOpportunities,
      meta: { authRequired: true },
    },
    {
      path: '/talent/opportunities/:id',
      name: 'TalentOpportunity',
      component: TalentOpportunity,
      props: true,
      meta: { authRequired: true },
    },
  ],
});

router.beforeEach(NavGuards.authenticationGuard);
router.beforeEach(NavGuards.alertComponentGuard);

export default router;
