import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WorkingRights } from 'constants/jobFields';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './styles.module.css';

type Props = {
  title: string;
  description: string;
  tag: string[];
  imgSrc: string;
};

const FeaturedJobCard = ({ title, description, tag, imgSrc }: Props) => {
  return (
    <Link href="/student/login">
      <div className="flex mx-4 mt-8 mb-12 flex-col justify-between shadow-card rounded-lg bg-white relative hover-anim">
        <div>
          <div className="flex justify-center min-w-0 mx-5">
            {imgSrc ? (
              <Image
                src={imgSrc}
                className="select-none pointer-events-none object-contain w-full py-4"
                height={180}
                alt="sponsor logo"
              />
            ) : (
              <FontAwesomeIcon
                icon={faBuilding}
                className="select-none pointer-events-none object-contain w-full py-4 min-h-[180px]"
              />
            )}
          </div>
          <h3 className="text-xl font-bold mx-4 mb-4">{title}</h3>
          <div className="h-[100px] flex flex-row flex-wrap m-0 justify-center items-center mx-2 my-2 xs:flex-col">
            {tag.map((tag) => (
              <div
                key={tag}
                className="flex justify-center items-center rounded-md my-1 mx-1 px-2 h-6 bg-jb-tags text-base"
              >
                {WorkingRights[tag as keyof typeof WorkingRights]}
              </div>
            ))}
          </div>
          <p
            className="text-base m-0 py-4 px-5 text-left text-jb-placeholder h-[200px] overflow-hidden text-ellipsis"
            dangerouslySetInnerHTML={{
              __html: description
            }}
          />
        </div>
        <div className="flex-justify-center mt-5">
          <button className={styles.learnMoreBtn}>Learn More</button>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedJobCard;
