import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// pages
const PageNotFoundPage = () => import("./pages/PageNotFound.vue");
const LoginPage = () => import("./pages/LoginPage.vue");
const StudentLoginPage = () => import("./pages/StudentLoginPage.vue");
const CompanyLoginPage = () => import("./pages/CompanyLoginPage.vue");
const JobsListPage = () => import("./pages/JobsListPage.vue");
const SingleJobPage = () => import("./pages/SingleJobPage.vue");

export default new Router({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes: [{
    path: "/login",
    component: LoginPage,
  }, {
    path: "/login/student",
    component: StudentLoginPage,
  }, {
    path: "/login/company",
    component: CompanyLoginPage,
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
