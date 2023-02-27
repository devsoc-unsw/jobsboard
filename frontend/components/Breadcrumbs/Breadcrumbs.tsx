'use client';

import React from 'react';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './styles.module.css';

type Breadcrumb = {
  name: string;
  link: string;
};

const Breadcrumbs = () => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    let breadcrumb: Breadcrumb[] = [];
    if (pathname?.includes('/login')) {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Login', link: pathname }
      ];
    } else if (pathname?.includes('/forgot')) {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Forgot Password', link: pathname }
      ];
    } else if (pathname?.includes('/reset')) {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Reset Password', link: pathname }
      ];
    } else if (pathname?.includes('/dashboard')) {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: pathname }
      ];
    } else if (pathname?.includes('/team')) {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Team', link: pathname }
      ];
    } else if (pathname?.includes('/signup')) {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Sign Up', link: pathname }
      ];
    }
    // Company specific routes breadcrumbs
    else if (pathname === '/company/post') {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/company/dashboard' },
        { name: 'Post Job', link: pathname }
      ];
    }
    // Student specific routes breadcrumbs
    else if (pathname?.includes('/student/job/')) {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/student/dashboard' },
        { name: 'Job', link: pathname }
      ];
    }
    // Admin specific routes breadcrumbs
    else if (pathname === '/admin/company') {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/admin/dashboard' },
        { name: 'Pending Companies', link: pathname }
      ];
    } else if (pathname === '/admin/jobs') {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/admin/dashboard' },
        { name: 'Pending Jobs', link: pathname }
      ];
    } else if (pathname === '/admin/post') {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/admin/dashboard' },
        { name: 'Post Job', link: pathname }
      ];
    }
    return breadcrumb;
  };

  const breadcrumbList = generateBreadcrumbs();

  return (
    <ul className="flex justify-start mt-10 mb-4 p-0 list-none font-bold">
      {breadcrumbList.map((breadcrumb, idx) => (
        <li
          className={`flex float-left h-5 w-auto items-center ${
            breadcrumb.link &&
            'text-jb-placeholder font-bold cursor-pointer text-base duration-200 ease-linear hover:text-jb-textlink-hovered'
          } ${styles.breadcrumbItem}`}
          key={breadcrumb.name}
        >
          <Link href={breadcrumbList[idx].link}>
            {breadcrumb.name === 'Home' ? (
              <div>
                <FontAwesomeIcon size="xs" icon={faHouse} />
              </div>
            ) : (
              <p
                className={
                  breadcrumb.link
                    ? 'text-jb-headings text-base font-bold'
                    : 'text-jb-placeholder font-bold cursor-pointer text-base duration-200 ease-linear hover:text-jb-textlink-hovered'
                }
              >
                {breadcrumb.name}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumbs;
