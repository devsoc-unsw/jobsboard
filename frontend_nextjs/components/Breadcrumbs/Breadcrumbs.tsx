'use client';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import styles from './styles.module.css';

type Breadcrumb = {
  name: string;
  link: string;
};

const Breadcrumbs = () => {
  const router = useRouter();
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
    } else if (pathname === '/company/post') {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/company/dashboard' },
        { name: 'Post Job', link: pathname }
      ];
    } else if (pathname?.includes('/student/job/')) {
      breadcrumb = [
        { name: 'Home', link: '/' },
        { name: 'Dashboard', link: '/student/dashboard' },
        { name: 'Job', link: pathname }
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
          key={idx}
          onClick={() => router.push(breadcrumbList[idx].link)}
        >
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
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumbs;
