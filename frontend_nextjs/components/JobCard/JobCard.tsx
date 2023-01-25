import React from 'react';
import { JobType, WorkingRights, JobMode } from 'constants/jobFields';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.css';
import {
  faAddressCard,
  faBuilding,
  faClock,
  faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

type JobCardProps = {
  jobID: number;
  jobTitle: number;
  jobLogo: string;
  jobType: string;
  jobTag: string[];
  jobLocation: string;
  jobRole: string;
  jobMode: string;
};

const JobCard = ({
  jobID,
  jobTitle,
  jobLogo,
  jobType,
  jobTag,
  jobLocation,
  jobRole,
  jobMode
}: JobCardProps) => {
  return (
    <Link href={`/student/job/${jobID}`}>
      <div className="flex flex-col rounded-lg shadow-card hover-anim w-60 h-full bg-white">
        <div className="flex m-5 justify-center">
          {jobLogo ? (
            <Image
              src={jobLogo}
              className="m-auto my-4 object-contain"
              alt="sponsor logo"
              width={180}
              height={100}
            />
          ) : (
            <FontAwesomeIcon icon={faBuilding} size="8x" className="mb-2" />
          )}
        </div>
        <h3 className="text-xl text-left font-bold mx-4 mb-4">{jobRole}</h3>
        <h3 className="text-l text-left font-bold mx-4">{jobTitle}</h3>

        <div className="flex flex-wrap flex-row m-0 items-center mx-4 my-2 gap-3 xs:flex-col xs:items-start">
          {jobTag.map((tag) => (
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
          <p className="ml-2">{jobLocation}</p>
        </div>
        <div className="flex items-center mx-4 my-1 mb-4">
          <FontAwesomeIcon className="w-4" icon={faAddressCard} />
          <p className="ml-2">{JobMode[jobMode as keyof typeof JobMode]}</p>
        </div>

        <div className="flex justify-center mt-auto">
          <button className={styles.learnMoreBtn}>Learn More</button>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
