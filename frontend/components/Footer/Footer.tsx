'use client';

import React from 'react';
import { faDiscord, faFacebook, faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import container from 'styles/container.module.css';
import logo from 'assets/logos/devsocwhite.png';

const Footer = () => {
  const socials = [
    {
      title: 'Facebook',
      icon: faFacebook,
      href: 'https://www.facebook.com/devsocUNSW'
    },
    {
      title: 'Instagram',
      icon: faInstagram,
      href: 'https://www.instagram.com/devsoc_unsw/'
    },
    {
      title: 'LinkedIn',
      icon: faLinkedin,
      href: 'https://www.linkedin.com/company/devsoc-unsw/'
    },
    {
      title: 'Github',
      icon: faGithub,
      href: 'https://github.com/devsoc-unsw'
    },
    {
      title: 'Discord',
      icon: faDiscord,
      href: 'https://discord.gg/u9p34WUTcs'
    }
  ];

  return (
    <div className="bg-jb-blue dark:bg-jb-dark-blue text-white py-5">
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
          <p className="m-0">&#169; DevSoc UNSW - 2024</p>
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
            DevSoc is the UNSW Software Development Society. We do not represent the School,
            Faculty, or University. This website seeks to be a centralised platform for students
            looking for employment opportunities, but its information has not been officially
            endorsed by the University, Faculty, School, or the Computer Science and Engineering
            Society. You should confirm with the employer that any information received through this
            website is correct.
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
