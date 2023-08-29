import React from 'react';
import {
  faAddressCard,
  faBuilding,
  faClock,
  faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { JobMode, JobType, WorkingRights } from 'constants/jobFields';
import styles from './styles.module.css';

type JobCardProps = {
  id: number;
  company: string;
  logo: string;
  jobType: string;
  workingRights: string[];
  location: string;
  role: string;
  mode: string;
};

const JobCard = ({
  id,
  company,
  logo,
  jobType,
  workingRights,
  location,
  role,
  mode
}: JobCardProps) => {
  return (
    <Link href={`/student/job/${id}`}>
      <div className="flex flex-col rounded-lg shadow-card hover-anim w-60 h-full bg-white">
        <div className="flex m-5 justify-center">
          {logo ? (
            <Image
              src={logo}
              className="m-auto my-4 object-contain rounded-lg"
              alt={company}
              width={180}
              height={100}
            />
          ) : (
            <FontAwesomeIcon icon={faBuilding} size="8x" className="my-4" />
          )}
        </div>
        <h3 className="text-xl text-left font-bold mx-4 mb-4">{role}</h3>
        <h3 className="text-l text-left font-bold mx-4">{company}</h3>

        <div className="flex flex-wrap flex-row m-0 items-center mx-4 my-2 gap-3 xs:flex-col xs:items-start">
          {workingRights.map((tag) => (
            <div
              key={tag}
              className="flex justify-center items-center rounded-md my-1 px-2 h-6 bg-jb-tags text-base"
            >
              {WorkingRights[tag as keyof typeof WorkingRights]}
            </div>
          ))}
        </div>

        <div className="flex items-center mx-4 my-1">
          <FontAwesomeIcon className="w-4" icon={faClock} />
          <p className="ml-2">{JobType[jobType as keyof typeof JobType]}</p>
        </div>
        <div className="flex items-center mx-4 my-1">
          <FontAwesomeIcon className="w-4" icon={faLocationDot} />
          <p className="ml-2">{location}</p>
        </div>
        <div className="flex items-center mx-4 my-1 mb-4">
          <FontAwesomeIcon className="w-4" icon={faAddressCard} />
          <p className="ml-2">{JobMode[mode as keyof typeof JobMode]}</p>
        </div>

        <div className="flex justify-center mt-auto">
          <button type="button" className={styles.learnMoreBtn}>
            Learn More
          </button>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
