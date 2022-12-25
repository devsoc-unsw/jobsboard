import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import React from 'react'

type Props = {
  jobID: number,
  role: string,
  company: string,
  location: string,
}

const JobListingMinimal = ({ jobID, role, company, location }: Props) => {
  const router = useRouter()
  const routeToJob = () => {
    router.push(`/jobs/${jobID}`);
  };

  return (
    // <!-- TODO: replace router push with window.open instead? -->
  <button
    className='flex flex-row mb-4 items-center p-4 shadow-card rounded-md w-full md:flex-col'
    onClick={routeToJob}
  >
    {/* <!-- TODO: to be replaced with company logo --> */}
    <FontAwesomeIcon
      icon={faBuilding}
      className='mr-4 md:mr-0'
      size="3x"
    />
    <div className='flex flex-col text-left pt-0 md:pt-4 md:text-center'>
      <h2 className='font-bold text-jb-headings'>
        {role }
      </h2>
      <p>{ company }</p>
      <p>{ location }</p>
    </div>
  </button>
  )
}

export default JobListingMinimal