import Vue from 'vue';
import Router from 'vue-router';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import Dashboard from '@/components/Employer/Dashboard';
import NavGuards from './nav-guards';

Vue.use(Router);

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
  ],
});

router.beforeEach(NavGuards.alertComponentGuard);

export default router;
