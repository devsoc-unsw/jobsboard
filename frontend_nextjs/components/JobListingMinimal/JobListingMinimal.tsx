import React from 'react';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

type JobListingMinimalProps = {
  id: number;
  role: string;
  company: string;
  location: string;
};

const JobListingMinimal = ({ id: jobID, role, company, location }: JobListingMinimalProps) => {
  return (
    // <!-- TODO: replace router push with window.open instead? -->
    <Link href={`/student/job/${jobID}`} className="mx-4 min-w-[160px]">
      <button
        type="button"
        className="flex flex-row mb-4 items-center p-4 shadow-card rounded-md w-full md:flex-col"
      >
        {/* <!-- TODO: to be replaced with company logo --> */}
        <FontAwesomeIcon icon={faBuilding} className="mr-4 md:mr-0" size="3x" />
        <div className="flex flex-col text-left pt-0 md:pt-4 md:text-center">
          <h2 className="font-bold text-jb-headings">{role}</h2>
          <p>{company}</p>
          <p>{location}</p>
        </div>
      </button>
    </Link>
  );
};

export default JobListingMinimal;
