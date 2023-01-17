'use client';
import React, { useEffect } from 'react';
import Robot from 'assets/misc/404_Robot.png';
import Image from 'next/image';
import styles from './not-found.module.css';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 5000);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full">
      <Image
        className="filter invert w-1/5 mt-10 mb-16 md:w-3/5 sm:w-1/2 xs:w-3/5"
        src={Robot}
        alt="logo"
      />
      <h1 className="text-5xl font-bold text-jb-headings">Page not Found</h1>
      <p className="text-xl text-jb-subheadings my-10 mx-[25%] md:mx-auto">
        Hmm... wondering how you ended up here in the middle of nowhere? &apos;Cause we&apos;re
        wondering that too. But don&apos;t worry, hang tight and we will beam you back to the home
        page in a couple of seconds.
      </p>
      <h3 className="text-xl font-bold">Redirecting</h3>
      <div className="m-4">
        <div className={styles.pulsingDot}>
          <div>
            <div className={styles.pulsingDot} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
