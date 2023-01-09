import { createRouter, createWebHistory } from 'vue-router';

type Breadcrumb = {
  name: string
  link?: string
}

declare module 'vue-router' {
  interface RouteMeta {
    title: string,
    breadcrumb?: Breadcrumb[]
  }
}

// pages
const LandingPage = () => import('@/pages/LandingPage.vue');
const PageNotFoundPage = () => import('@/pages/PageNotFound.vue');
const StudentLoginPage = () => import('@/pages/StudentLoginPage.vue');
const CompanyLoginPage = () => import('@/pages/CompanyLoginPage.vue');
const CompanySignupPage = () => import('@/pages/CompanySignupPage.vue');
const CompanyPasswordForgotPage = () => import('@/pages/CompanyPasswordForgotPage.vue');
const CompanyPasswordResetPage = () => import('@/pages/CompanyPasswordResetPage.vue');
const JobsListPage = () => import('@/pages/JobsListPage.vue');
const SingleJobPage = () => import('@/pages/SingleJobPage.vue');
const CompanyAccountHome = () => import('@/pages/CompanyAccountHome.vue');
const CompanyAddJob = () => import('@/pages/CompanyAddJob.vue');
const AdminLoginPage = () => import('@/pages/AdminLoginPage.vue');
const AdminAccountHome = () => import('@/pages/AdminAccountHome.vue');
const AdminListPendingJobs = () => import('@/pages/AdminListPendingJobs.vue');
const AdminListCompanyPendingVerification = () => import('@/pages/AdminListCompanyPendingVerification.vue');
const AdminCreateJobAsCompany = () => import('@/pages/AdminCreateJobAsCompany.vue');
const TeamPage = () => import('@/pages/TeamPage.vue');

export default createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ y: 0 }),
  routes: [{
    path: '/login/student',
    component: StudentLoginPage,
    meta: {
      title: 'Login | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Login' },
      ],
    },
  }, {
    path: '/login/company',
    component: CompanyLoginPage,
    meta: {
      title: 'Login | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Login' },
      ],
    },
  }, {
    path: '/login/admin',
    component: AdminLoginPage,
    meta: {
      title: 'Login | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Login' },
      ],
    },
  }, {
    path: '/signup/company',
    component: CompanySignupPage,
    meta: {
      title: 'Sign Up | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Sign Up' },
      ],
    },
  }, {
    path: '/company/home',
    component: CompanyAccountHome,
    meta: {
      title: 'Home | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard' },
      ],
    },
  }, {
    path: '/admin/home',
    component: AdminAccountHome,
    meta: {
      title: 'Home | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard' },
      ],
    },
  }, {
    path: '/admin/jobs/pending',
    component: AdminListPendingJobs,
    meta: {
      title: 'Pending Jobs | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/admin/home' },
        { name: 'Jobs' },
      ],
    },
  }, {
    path: '/admin/companies/pending',
    component: AdminListCompanyPendingVerification,
    meta: {
      title: 'Pending Companies | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/admin/home' },
        { name: 'Companies' },
      ],
    },
  }, {
    path: '/admin/jobs/post',
    component: AdminCreateJobAsCompany,
    meta: {
      title: 'Post Job | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/admin/home' },
        { name: 'Post' },
      ],
    },
  }, {
    path: '/company/jobs/add',
    component: CompanyAddJob,
    meta: {
      title: 'Post Job | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/company/home' },
        { name: 'Post Job' },
      ],
    },
  }, {
    path: '/jobs',
    component: JobsListPage,
    meta: {
      title: 'Jobs List | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Job List' },
      ],
    },
  }, {
    path: '/job/:jobID',
    component: SingleJobPage,
    props: true,
    name: 'job',
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Job List', link: '/jobs' },
        { name: 'Job' },
      ],
    },
  }, {
    path: '/company/password-forgot',
    component: CompanyPasswordForgotPage,
    meta: {
      title: 'Forgot Password | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Forgot Password' },
      ],
    },
  }, {
    path: '/company/password-reset/:token',
    component: CompanyPasswordResetPage,
    props: true,
    name: 'token',
    meta: {
      title: 'Reset Password | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Reset Password' },
      ],
    },
  }, {
    path: '/team',
    component: TeamPage,
    meta: {
      title: 'Team | Jobs Board',
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Team' },
      ],
    },
  }, {
    path: '/',
    component: LandingPage,
    meta: {
      title: 'Home | Jobs Board',
    },
  }, {
    path: '/:pathMatch(.*)*',
    component: PageNotFoundPage,
    meta: {
      title: 'Page Not Found | Jobs Board',
    },
  }],
} as any);
