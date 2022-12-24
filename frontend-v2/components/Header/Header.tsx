"use client"
import React, { useContext } from 'react'
import logo from 'assets/logos/csesocwhite.png';
import moon from 'assets/misc/moon.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AppContext from 'app/AppContext';

// .tooltipText {
//   top: 150%;
//   transform: translate(-50%, 0);
// }
// // tooltip
// .tooltipText::after {
//   content: "";
//   position: absolute;
//   bottom: 100%;
//   left: 50%;
//   margin-left: -5px;
//   border-width: 5px;
//   border-style: solid;
//   border-color: transparent transparent white transparent;
// }

type Props = {
  style?: React.CSSProperties
}

const Header = ({ style }: Props) => {
  const router = useRouter();
  const { apiToken, resetApiToken } = useContext(AppContext);

  const handleLogout = () => {
    resetApiToken()
    router.push('/login/student');
  };

  return (
    <div
    style={style}
    className='flex justify-evenly items-center py-4 px-[5%]
           bg-gradient-to-br from-[#3a76f8] via-[#2c8bf4] to-[#619fcc]'
  >
    <Image
      className='w-[10%] cursor-pointer xl:w-[15%] lg:w-[17%] md:w-[20%] sm:w-[25%]'
      src={logo}
      alt='CSESoc'
      onClick={() => router.push("/")}
    />
    <div className='flex justify-evenly items-center'>
      <div className='group fill-black cursor-pointer w-[20%] mr-5 sm:mr-2.5 relative inline-block'>
        <Image
          className='rotate-220'
          src={moon}
          alt='Toggle Theme'
        />
        {/* <!-- tooltip --> */}
        <span className='invisible group-hover:visible bg-white text-black font-bold shadow-card w-32 text-center rounded py-2 absolute z-10 tooltipText'>
          Coming soon
        </span>
      </div>
      {!apiToken ? <button
          className='bg-transparent border-2 border-solid border-[#f9f7f1] rounded-2xl text-[#f9f7f1]
                 py-[2px] px-[15px] font-bold cursor-pointer duration-500 hover:bg-white hover:text-[#3a76f8]
                 hover:translate-y-[-2px] hover:shadow-lg'
                 onClick={() => router.push("/login/student")}
        >
          Log In
        </button> : <button
          className='bg-transparent border-2 border-solid border-[#f9f7f1] rounded-2xl text-[#f9f7f1]
                 py-[5px] px-[15px] font-bold cursor-pointer duration-500 hover:bg-white hover:text-[#3a76f8]
                 hover:translate-y-[-2px] hover:shadow-lg'
          onClick={handleLogout}
        >
          Logout
        </button> }
    </div>
  </div>
  )
}

export default Header