"use client"
import Image from 'next/image';
import logo from 'assets/logos/csesocwhite.png';
import facebookLogo from 'assets/SocialMedia/facebook.svg';
import instagramLogo from 'assets/SocialMedia/instagram.svg';
import linkedinLogo from 'assets/SocialMedia/linkedin.svg';
import youtubeLogo from 'assets/SocialMedia/youtube.svg';
import discordLogo from 'assets/SocialMedia/discord.svg';
import githubLogo from 'assets/SocialMedia/github.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import container from 'styles/container.module.css';
import { useRouter } from 'next/navigation';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const router = useRouter()
  return (
    <div className='bg-jb-blue md:flex-col text-white py-5'>
    <div className={`flex justify-between items-center ${container.pageContainer}`}>
      {/* TODO <style scoped lang="scss">
      a {
        display: flex;
        justify-content: center;
        color: #ffffff;
      }
      </style> */}
      <div>
        <Image
          alt='logo'
          className='inline pt-4 pr-4 pl-4 w-1/2 lg:w-2/3 sm:w-1/2'
          src={logo}
        />
        <div className='py-2.5 font-bold'>
          <a
            className='py-2.5'
            href='https://docs.google.com/forms/d/e/1FAIpQLSeldliO0mbbbJWvJk3CoUhiN-ACwmHGnX-e3xtO-l4rGk9bPg/viewform'
            target='_blank' rel="noreferrer"
          >
            Got a Question?
          </a>
          <a
            className='cursor-pointer'
            onClick={() => router.push('/team')}
          >Meet the Team</a>
        </div>
        <p className='m-0'>
          &#169; CSESoc UNSW - 2022
        </p>
        <div className='flex justify-center py-[15px]'>
          <a
            href='https://www.facebook.com/csesoc'
            target='__blank'
          >
            <Image
            alt='facebook'
              className='block w-1/2'
              src={facebookLogo}
            />
          </a>
          <a
            href='https://www.instagram.com/csesoc_unsw/?hl=en'
            target='__blank'
          >
            <Image
              alt='instagram'
              className='block w-1/2'
              src={instagramLogo}
            />
          </a>
          <a
            href='https://au.linkedin.com/company/csesoc'
            target='__blank'
          >
            <Image
                className='block w-1/2'
                src={linkedinLogo} alt={''}          />
          </a>
          <a
            href='https://www.youtube.com/channel/UC1JHpRrf9j5IKluzXhprUJg'
            target='__blank'
          >
            <Image
                className='block w-1/2'
                src={youtubeLogo} alt={''}          />
          </a>
          <a
            href='https://bit.ly/CSESocDiscord'
            target='__blank'
          >
            <Image
                className='block w-1/2'
                src={discordLogo} alt={''}          />
          </a>
          <a
            href='https://github.com/csesoc'
            target='__blank'
          >
            <Image
                className='block w-1/2'
                src={githubLogo} alt={''}          />
          </a>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center text-justify px-[30px]'>
        <p className='m-0'>
          CSESoc is the constituent student society of UNSW&apos;s School of Computer Science
          and Engineering. We do not represent the School, Faculty, or University.
          This website seeks to be a centralised platform for students looking
          for employment opportunities, but its information has not been officially
          endorsed by  the University, Faculty, School, or the Computer Science and
          Engineering Society.  You should confirm with the employer that any information
          received through this website is correct.
          <br/>
          <br/>
          Jobsboard was made with <FontAwesomeIcon icon={faHeart} /> by CSE students for CSE students.
        </p>
      </div>
  </div>
  </div>
  )
}

export default Footer;