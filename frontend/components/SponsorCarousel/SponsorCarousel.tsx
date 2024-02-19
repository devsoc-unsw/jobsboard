import React from 'react';
import Image from 'next/image';
import JaneStreetLogo from 'assets/companies/janeStreetLogo.png';
import TikTokLogo from 'assets/companies/tiktokLogo.png';
import styles from './SponsorCarousel.module.css';

const sponsors = [
  {
    company: 'Jane Street',
    logo: JaneStreetLogo
  },
  {
    company: 'TikTok',
    logo: TikTokLogo
  }
];

const Images = () => {
  return (
    <>
      {sponsors.map(({ company, logo }) => (
        <div className="grow-1 shrink-1 basis-[200px] min-w-0 m-5" key={company}>
          <Image
            className="select-none pointer-events-none object-contain w-full"
            width={100}
            height={100}
            src={logo}
            loading="lazy"
            alt={company}
          />
        </div>
      ))}
    </>
  );
};

const DynamicSponsors = () => {
  return (
    <div className="relative overflow-hidden grow-0 shrink-0 basis-[230px]">
      <div className={styles.carouselBarLeft} />
      <div className="relative w-[1450px] h-[100px] my-10 grow-0 shrink-0 basis-auto">
        <div className={`${styles.sponsorContainer} ${styles.carouselAnimationFirst}`}>
          <Images />
        </div>
        <div className={`${styles.sponsorContainer} ${styles.carouselAnimationSecond}`}>
          <Images />
        </div>
      </div>
      <div className={styles.carouselBarRight} />
    </div>
  );
};

const StaticSponsors = () => {
  return (
    <div className={styles.staticSponsorContainer}>
      <Images />
    </div>
  );
};

const SponsorCarousel = () => {
  return <div>{sponsors.length > 3 ? <DynamicSponsors /> : <StaticSponsors />}</div>;
};

export default SponsorCarousel;
