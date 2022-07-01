import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// pages
const LandingPage = () => import("@/pages/LandingPage.vue");
const PageNotFoundPage = () => import("@/pages/PageNotFound.vue");
const LoginPage = () => import("@/pages/LoginPage.vue");
const StudentLoginPage = () => import("@/pages/StudentLoginPage.vue");
const CompanyLoginPage = () => import("@/pages/CompanyLoginPage.vue");
const CompanySignupPage = () => import("@/pages/CompanySignupPage.vue");
const CompanyPasswordForgotPage = () => import("@/pages/CompanyPasswordForgotPage.vue");
const CompanyPasswordResetPage = () => import("@/pages/CompanyPasswordResetPage.vue");
const JobsListPage = () => import("@/pages/JobsListPage.vue");
const SingleJobPage = () => import("@/pages/SingleJobPage.vue");
const CompanyAccountHome = () => import("@/pages/CompanyAccountHome.vue");
const CompanyAddJob = () => import("@/pages/CompanyAddJob.vue");
const AdminLoginPage = () => import("@/pages/AdminLoginPage.vue");
const AdminAccountHome = () => import("@/pages/AdminAccountHome.vue");
const AdminListPendingJobs = () => import("@/pages/AdminListPendingJobs.vue");
const AdminListCompanyPendingVerification = () => import("@/pages/AdminListCompanyPendingVerification.vue");
const AdminCreateJobAsCompany = () => import("@/pages/AdminCreateJobAsCompany.vue");
const CompanyManageJobs = () => import("@/pages/CompanyManageJobs.vue");
const TeamPage = () => import("@/pages/TeamPage.vue");

export default new Router({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes: [{
    path: "/login/student",
    component: StudentLoginPage,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Login' }
      ]
    }
  }, {
    path: "/login/company",
    component: CompanyLoginPage,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Login' }
      ]
    }
  }, {
    path: "/login/admin",
    component: AdminLoginPage,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Login' }
      ]
    }
  }, {
    path: "/signup/company",
    component: CompanySignupPage,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Sign Up' }
      ]
    }
  }, {
    path: "/company/home",
    component: CompanyAccountHome,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard' }
      ]
    }
  }, {
    path: "/admin/home",
    component: AdminAccountHome,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard'}
      ]
    }
  }, {
    path: "/admin/jobs/pending",
    component: AdminListPendingJobs,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/admin/home' },
        { name: 'Jobs' }
      ]
    }
  }, {
    path: "/admin/companies/pending",
    component: AdminListCompanyPendingVerification,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/admin/home' },
        { name: 'Companies' }
      ]
    }
  }, {
    path: "/admin/jobs/post",
    component: AdminCreateJobAsCompany,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/admin/home' },
        { name: 'Post' }
      ]
    }
  }, {
    path: "/company/jobs/add",
    component: CompanyAddJob,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/company/home' },
        { name: 'Post Job' }
      ]
    }
  }, {
    path: "/login",
    component: LoginPage,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Login' }
      ]
    }
  }, {
    path: "/jobs",
    component: JobsListPage,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Job List' }
      ]
    }
  }, {
    path: "/job/:jobID",
    component: SingleJobPage,
    props: true,
    name: "job",
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Job List' , link: '/jobs' },
        { name: 'Job' }
      ]
    }
  }, {
    path: "/company/jobs/manage",
    component: CompanyManageJobs,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/company/home' },
        { name: 'Manage Jobs' }
      ]
    }
  }, {
    path: "/company/password-forgot",
    component: CompanyPasswordForgotPage,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Forgot Password' }
      ]
    }
  }, {
    path: "/company/password-reset/:token",
    component: CompanyPasswordResetPage,
    props: true,
    name: "token",
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Reset Password' }
      ]
    }
  }, {
    path: "/team",
    component: TeamPage,
    meta: {
      breadcrumb: [
        { name: 'Home', link: '/' },
        { name: 'Team' }
      ]
    }
  }, {
    path: "/",
    component: LandingPage,
  }, {
    path: "*",
    component: PageNotFoundPage,
  }],
} as any);
