import Vue from "vue";
import App from "./App.vue";

import { library, IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBuilding,
  faChevronLeft,
  faSignOutAlt,
  faSuitcase,
  faHeart,
  faChevronCircleUp,
  faCalendar,
  faGraduationCap,
  faCircleDollarToSlot,
  faLink,
  faAddressCard,
  faUser,
  faCircleInfo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import {
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import store from "./store/store";
import './style/tailwind.scss';

library.add(faBuilding as IconDefinition);
library.add(faChevronLeft as IconDefinition);
library.add(faSignOutAlt as IconDefinition);
library.add(faSuitcase as IconDefinition);
library.add(faHeart as IconDefinition);
library.add(faGithub as IconDefinition);
library.add(faLinkedin as IconDefinition);
library.add(faChevronCircleUp as IconDefinition);
library.add(faCalendar as IconDefinition);
library.add(faGraduationCap as IconDefinition);
library.add(faCircleDollarToSlot as IconDefinition);
library.add(faLink as IconDefinition);
library.add(faAddressCard as IconDefinition);
library.add(faUser as IconDefinition);
library.add(faCircleInfo as IconDefinition);
<<<<<<< HEAD
library.add(faBars as IconDefinition);
library.add(faUserGroup as IconDefinition);
library.add(faLocationDot as IconDefinition);
library.add(faTrashAlt as IconDefinition);
=======
library.add(faXmark as IconDefinition);
>>>>>>> eea9634666d5c03810620e6e818908cc72032fad

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

import router from "./router";

const app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
