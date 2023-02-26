'use client';

import React, { useContext } from 'react';
import AppContext from 'app/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logo from 'assets/logos/csesocwhite.png';
import moon from 'assets/misc/moon.svg';
import styles from './styles.module.css';

type DarkModeProperties = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

type HeaderProps = {
  style?: React.CSSProperties;
  dark: DarkModeProperties;
};

const Header = ({ style, dark }: HeaderProps) => {
  const router = useRouter();
  const { apiToken, resetApiToken } = useContext(AppContext);

  const { darkMode, setDarkMode } = dark;

  const handleLogout = () => {
    resetApiToken();
    router.push('/student/login');
  };

  return (
    <div
      style={style}
      className="flex justify-evenly items-center py-4
           bg-gradient-to-br from-[#3a76f8] via-[#2c8bf4] to-[#619fcc]"
    >
      <Link href="/">
        <Image className="cursor-pointer" src={logo} width={150} alt="CSESoc" />
      </Link>
      <div className="flex justify-evenly items-center gap-5">
        <button
          type="button"
          className="group cursor-pointer relative"
          onClick={() => {setDarkMode(!darkMode)}}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <Image className="rotate-220" src={moon} alt="Toggle Theme" width={25} />
          {/* Tooltip */}
          <span
            className={`invisible group-hover:visible bg-white text-black font-bold shadow-card w-32 p-1 text-center rounded py-2 absolute z-10 ${styles.tooltipText}`}
          >
            {!darkMode ? "Enable Dark Mode" : "Disable Dark Mode"}
          </span>
        </button>

        {!apiToken ? (
          <Link href="/student/login">
            <button
              type="button"
              className="bg-transparent border-2 border-solid border-[#f9f7f1] rounded-2xl text-[#f9f7f1]
                 py-[2px] px-[15px] font-bold cursor-pointer duration-500 hover:bg-white hover:text-[#3a76f8]
                 hover:translate-y-[-2px] hover:shadow-lg"
            >
              Log In
            </button>
          </Link>
        ) : (
          <button
            type="button"
            className="bg-transparent border-2 border-solid border-[#f9f7f1] rounded-2xl text-[#f9f7f1]
                 py-[5px] px-[15px] font-bold cursor-pointer duration-500 hover:bg-white hover:text-[#3a76f8]
                 hover:translate-y-[-2px] hover:shadow-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
