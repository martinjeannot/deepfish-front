import Vue from 'vue';
import Router from 'vue-router';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import PasswordReset from '@/components/PasswordReset';
import AdminDashboard from '@/components/Admin/Dashboard/Dashboard';
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
import AdminDMInterviews from '@/components/Admin/DataManagement/Master/Interviews';
import AdminDMInterview from '@/components/Admin/DataManagement/Master/Interview';
import AdminDMUsers from '@/components/Admin/DataManagement/Master/Users';
import AdminDMNewUser from '@/components/Admin/DataManagement/Master/NewUser';
import AdminDMCompanyMaturityLevels from '@/components/Admin/DataManagement/Reference/CompanyMaturityLevels';
import AdminDMUtms from '@/components/Admin/DataManagement/Reference/Utms';
import AdminStatisticsOpportunities from '@/components/Admin/Statistics/Opportunities';
import AdminStatisticsTalentAcquisition from '@/components/Admin/Statistics/TalentAcquisition';
import EmployerProfile from '@/components/Employer/Profile';
import EmployerRequirements from '@/components/Employer/Requirements/Requirements';
import EmployerRequirement from '@/components/Employer/Requirements/Requirement';
import EmployerTypeformRequirement from '@/components/Employer/Requirements/TypeformRequirement';
import EmployerCalendlyRequirement from '@/components/Employer/Requirements/CalendlyRequirement';
import EmployerTalents from '@/components/Employer/Talents/Talents';
import EmployerInterviewScheduling from '@/components/Employer/Interview/Scheduling';
import EmployerPricing from '@/components/Employer/Pricing';
import TalentProfile from '@/components/Talent/Profile';
import TalentConditions from '@/components/Talent/Conditions';
import TalentOpportunities from '@/components/Talent/Opportunities/Opportunities';
import TalentOpportunity from '@/components/Talent/Opportunities/Opportunity';
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
      path: '/talent-sign-in',
      name: 'TalentSignIn',
      redirect: { name: 'SignIn' },
    },
    {
      path: '/employer-sign-in',
      name: 'EmployerSignIn',
      redirect: { name: 'SignIn' },
    },
    {
      path: '/password-reset',
      name: 'PasswordReset',
      component: PasswordReset,
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/talent-sign-up',
      name: 'TalentSignUp',
      redirect: { name: 'SignUp' },
    },
    {
      path: '/employer-sign-up',
      name: 'EmployerSignUp',
      redirect: { name: 'SignUp' },
    },
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      beforeEnter: (to, from, next) => {
        let queryParams = new URLSearchParams();
        if (location.search) {
          queryParams = new URLSearchParams(location.search);
        } else if (location.hash) {
          queryParams = new URLSearchParams(location.hash.split('?').pop());
        }
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
          if (store.getters.user.requirements.length) {
            next('/employer/talents');
          } else {
            next({ name: 'EmployerRequirements' });
          }
        } else if (store.getters.isUserTalent) {
          if (store.getters.user.phoneNumber !== 'null') {
            next('/talent/opportunities');
          } else {
            next('/talent/profile');
          }
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
      path: '/admin/data-management/master/interviews',
      name: 'AdminDMInterviews',
      component: AdminDMInterviews,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/master/interviews/:id',
      name: 'AdminDMInterview',
      component: AdminDMInterview,
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
      name: 'AdminDMCompanyMaturityLevels',
      component: AdminDMCompanyMaturityLevels,
      meta: { authRequired: true },
    },
    {
      path: '/admin/data-management/reference/utms',
      name: 'AdminDMUtms',
      component: AdminDMUtms,
      meta: { authRequired: true },
    },
    // Statistics
    {
      path: '/admin/statistics/opportunities',
      name: 'AdminStatisticsOpportunities',
      component: AdminStatisticsOpportunities,
      meta: { authRequired: true },
    },
    {
      path: '/admin/statistics/talent-acquisition',
      name: 'AdminStatisticsTalentAcquisition',
      component: AdminStatisticsTalentAcquisition,
      meta: { authRequired: true },
    },
    // EMPLOYER ====================================================================================
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
      path: '/employer/requirements/:id',
      name: 'EmployerRequirement',
      component: EmployerRequirement,
      props: true,
      meta: { authRequired: true },
    },
    {
      path: '/employer/requirements/online',
      name: 'EmployerTypeformRequirement',
      component: EmployerTypeformRequirement,
      meta: { authRequired: true },
    },
    {
      path: '/employer/requirements/call',
      name: 'EmployerCalendlyRequirement',
      component: EmployerCalendlyRequirement,
      meta: { authRequired: true },
    },
    {
      path: '/employer/talents',
      name: 'EmployerTalents',
      component: EmployerTalents,
      meta: { authRequired: true },
    },
    {
      path: '/employer/interviews/scheduling',
      name: 'EmployerInterviewScheduling',
      component: EmployerInterviewScheduling,
      props: route => ({ talentId: route.query['talent-id'], opportunityId: route.query['opportunity-id'] }),
      meta: { authRequired: true },
    },
    {
      path: '/employer/pricing',
      name: 'EmployerPricing',
      component: EmployerPricing,
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
