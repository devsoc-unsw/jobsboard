'use client';

import React from 'react';
import {
  faDiscord,
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import container from 'styles/container.module.css';
import logo from 'assets/logos/csesocwhite.png';

const Footer = () => {
  const socials = [
    {
      title: 'Facebook',
      icon: faFacebook,
      href: 'https://www.facebook.com/csesoc'
    },
    {
      title: 'Instagram',
      icon: faInstagram,
      href: 'https://www.instagram.com/csesoc_unsw/?hl=en'
    },
    {
      title: 'LinkedIn',
      icon: faLinkedin,
      href: 'https://au.linkedin.com/company/csesoc'
    },
    {
      title: 'YouTube',
      icon: faYoutube,
      href: 'https://www.youtube.com/channel/UC1JHpRrf9j5IKluzXhprUJg'
    },
    {
      title: 'Discord',
      icon: faDiscord,
      href: 'https://bit.ly/CSESocDiscord'
    },
    {
      title: 'Github',
      icon: faGithub,
      href: 'https://github.com/csesoc'
    }
  ];

  return (
    <div className="bg-jb-blue text-white py-5">
      <div className={`flex justify-center sm:flex-wrap items-center ${container.pageContainer}`}>
        <div className="flex flex-col items-center font-bold gap-3">
          <Image alt="logo" src={logo} width={250} />
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeldliO0mbbbJWvJk3CoUhiN-ACwmHGnX-e3xtO-l4rGk9bPg/viewform"
            target="_blank"
            rel="noreferrer"
          >
            Got a Question?
          </a>
          <Link className="cursor-pointer" href="/team">
            Meet the Team
          </Link>
          <p className="m-0">&#169; CSESoc UNSW - 2022</p>
          <div className="flex justify-center py-[15px] gap-5">
            {socials.map((s) => (
              <a href={s.href} target="__blank" key={s.title}>
                <FontAwesomeIcon icon={s.icon} size="lg" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center text-justify px-[30px]">
          <p className="m-0">
            CSESoc is the constituent student society of UNSW&apos;s School of Computer Science and
            Engineering. We do not represent the School, Faculty, or University. This website seeks
            to be a centralised platform for students looking for employment opportunities, but its
            information has not been officially endorsed by the University, Faculty, School, or the
            Computer Science and Engineering Society. You should confirm with the employer that any
            information received through this website is correct.
            <br />
            <br />
            Jobsboard was made with <FontAwesomeIcon icon={faHeart} /> by CSE students for CSE
            students.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
