import { createApp, VueElement } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './style/tailwind.scss';

// set up fontawesome
import { library, IconDefinition, Icon } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
  faBars,
  faUserGroup,
  faTrashAlt,
  faBell,
  faXmark,
  faLocationDot,
  faUserShield,
  faAngleRight,
  faBriefcase,
  faHouse,
  faPlus,
  faCloudUpload,
  faMoneyBills,
  faCode,
  faPeopleGroup,
  faClock,
  faClipboard,
  faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";

import {
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

// set up pinia
const pinia = createPinia();

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
library.add(faBars as IconDefinition);
library.add(faUserGroup as IconDefinition);
library.add(faLocationDot as IconDefinition);
library.add(faTrashAlt as IconDefinition);
library.add(faBell as IconDefinition);
library.add(faXmark as IconDefinition);
library.add(faUserShield as IconDefinition);
library.add(faAngleRight as IconDefinition);
library.add(faBriefcase as IconDefinition);
library.add(faHouse as IconDefinition);
library.add(faPlus as IconDefinition);
library.add(faCloudUpload as IconDefinition);
library.add(faMoneyBills as IconDefinition);
library.add(faCode as IconDefinition);
library.add(faPeopleGroup as IconDefinition);
library.add(faClock as IconDefinition);
library.add(faClipboard as IconDefinition);
library.add(faMagnifyingGlass as IconDefinition);


const app = createApp(App);
app.use(router);
app.use(pinia);
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app');
