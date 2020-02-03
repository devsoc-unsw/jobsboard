import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// pages
const PageNotFoundPage = () => import("@/pages/PageNotFound.vue");
const LoginPage = () => import("@/pages/LoginPage.vue");
const StudentLoginPage = () => import("@/pages/StudentLoginPage.vue");
const CompanyLoginPage = () => import("@/pages/CompanyLoginPage.vue");
const CompanySignupPage = () => import("@/pages/CompanySignupPage.vue");
const JobsListPage = () => import("@/pages/JobsListPage.vue");
const SingleJobPage = () => import("@/pages/SingleJobPage.vue");
const CompanyAccountHome = () => import("@/pages/CompanyAccountHome.vue");
const CompanyAddJob = () => import("@/pages/CompanyAddJob.vue");
const AdminLoginPage = () => import("@/pages/AdminLoginPage.vue");
const AdminAccountHome = () => import("@/pages/AdminAccountHome.vue");
const AdminListPendingJobs = () => import("@/pages/AdminListPendingJobs.vue");

export default new Router({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes: [{
    path: "/login/student",
    component: StudentLoginPage,
  }, {
    path: "/login/company",
    component: CompanyLoginPage,
  }, {
    path: "/login/admin",
    component: AdminLoginPage,
  }, {
    path: "/signup/company",
    component: CompanySignupPage,
  }, {
    path: "/company/home",
    component: CompanyAccountHome,
  }, {
    path: "/admin/home",
    component: AdminAccountHome,
  }, {
    path: "/admin/jobs/pending",
    component: AdminListPendingJobs,
  }, {
    path: "/company/jobs/add",
    component: CompanyAddJob,
  }, {
    path: "/login",
    component: LoginPage,
  }, {
    path: "/jobs",
    component: JobsListPage,
  }, {
    path: "/job",
    component: SingleJobPage,
  }, {
    path: "*",
    component: PageNotFoundPage,
  }],
} as any);
