import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

const JobPostCard = () => {
  return (
    <div>
      <div className="mt-6 ml-6 mb-8 bg-[#ECECEC] rounded-lg w-48 h-56">
        <div className="grid">
          <p className="font-extrabold text-2xl text-jb-headings text-center mt-10 mb-4">
            Post Job
          </p>
          <Link href="/company/post">
            <div className="flex justify-center items-center bg-white w-16 h-16 rounded-full cursor-pointer justify-self-center">
              <FontAwesomeIcon icon={faPlus} size="2x" className="text-jb-headings" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobPostCard;
