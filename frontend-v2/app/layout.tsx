import Header from "components/Header/Header";
import Footer from "../components/Footer/Footer"
import '../styles/globals.css';
// set up fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
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
  faMagnifyingGlass,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

import {
  faGithub,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import container from '../styles/container.module.css'

library.add(faBuilding);
library.add(faChevronLeft);
library.add(faSignOutAlt);
library.add(faSuitcase);
library.add(faHeart);
library.add(faGithub);
library.add(faLinkedin);
library.add(faChevronCircleUp);
library.add(faCalendar);
library.add(faGraduationCap);
library.add(faCircleDollarToSlot);
library.add(faLink);
library.add(faAddressCard);
library.add(faUser);
library.add(faCircleInfo);
library.add(faBars);
library.add(faUserGroup);
library.add(faLocationDot);
library.add(faTrashAlt);
library.add(faBell);
library.add(faXmark);
library.add(faUserShield);
library.add(faAngleRight);
library.add(faBriefcase);
library.add(faHouse);
library.add(faPlus);
library.add(faCloudUpload);
library.add(faMoneyBills);
library.add(faCode);
library.add(faPeopleGroup);
library.add(faClock);
library.add(faClipboard);
library.add(faMagnifyingGlass);
library.add(faEye);
library.add(faEyeSlash);

import { Assistant } from '@next/font/google'
import AppProvider from "./AppProvider";

const assistant = Assistant({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body className={assistant.className}>
        <AppProvider>
          {children}
          <Footer />
        </AppProvider>
      </body>
    </html>
  )
}
