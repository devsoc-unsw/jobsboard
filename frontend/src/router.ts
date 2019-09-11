import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// pages
const PageNotFoundPage = () => import("./pages/PageNotFound.vue");
const LoginPage = () => import("./pages/LoginPage.vue");
const StudentLoginPage = () => import("./pages/StudentLoginPage.vue");

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
    path: "*",
    component: PageNotFoundPage,
  }],
} as any);
