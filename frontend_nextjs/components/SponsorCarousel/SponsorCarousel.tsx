import React from 'react';
import GoogleLogo from 'assets/companies/googleLogo.png';
import AmazonLogo from 'assets/companies/amazonLogo.png';
import PearlerLogo from 'assets/companies/PearlerLogo.png';
import CanvaLogo from 'assets/companies/canvaLogo.png';
import JaneStreetLogo from 'assets/companies/janeStreetLogo.png';
import AtlassianLogo from 'assets/companies/atlassianLogo.png';
import Image from 'next/image';
import styles from './SponsorCarousel.module.css';

const sponsors = [
  {
    company: 'Google',
    logo: GoogleLogo
  },
  {
    company: 'Amazon',
    logo: AmazonLogo
  },
  {
    company: 'Pearler',
    logo: PearlerLogo
  },
  {
    company: 'Canva',
    logo: CanvaLogo
  },
  {
    company: 'Jane Street',
    logo: JaneStreetLogo
  },
  {
    company: 'Atlassian',
    logo: AtlassianLogo
  }
];

const SponsorCarousel = () => {
  return (
    <div>
      <div className="relative overflow-hidden grow-0 shrink-0 basis-[230px]">
        <div className={styles.carouselBarLeft} />
        <div className="relative w-[1450px] h-[100px] my-10 grow-0 shrink-0 basis-auto">
          <div className={`${styles.sponsorContainer} ${styles.carouselAnimationFirst}`}>
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
          </div>
          <div className={`${styles.sponsorContainer} ${styles.carouselAnimationSecond}`}>
            {sponsors.map(({ company, logo }) => (
              <div className="grow-1 shrink-1 basis-[200px] min-w-0 m-5" key={company}>
                <Image
                  className="select-none pointer-events-none object-contain w-full"
                  src={logo}
                  width={100}
                  height={100}
                  loading="lazy"
                  alt={company}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.carouselBarRight} />
      </div>
    </div>
  );
};

export default SponsorCarousel;
