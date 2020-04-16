import Vue from "vue";
import App from "./App.vue";

import { library, IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBuilding,
  faChevronLeft,
  faSignOutAlt,
  faSuitcase,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

import {
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import store from "./store/store";

library.add(faBuilding);
library.add(faChevronLeft);
library.add(faSignOutAlt);
library.add(faSuitcase);
library.add(faHeart);
library.add(faGithub as IconDefinition);
library.add(faLinkedin as IconDefinition);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

import router from "./router";

const app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
