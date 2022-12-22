import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import React from 'react'

const JobPostCard = () => {
  const router = useRouter();
  return (
    <div>
    <div className='mt-6 ml-6 mb-8 bg-[#ECECEC] rounded-lg w-48 h-56'>
      <div className='grid'>
        <p className='font-extrabold text-2xl text-jb-headings text-center mt-10 mb-4'>
          Post Job
        </p>
        <div
          className='flex justify-center items-center bg-white w-16 h-16 rounded-full cursor-pointer justify-self-center'
          onClick={() => router.push("/company/jobs/add")}
        >
          <FontAwesomeIcon
            icon='plus'
            size='2x'
            className='text-jb-headings'
          />
        </div>
      </div>
    </div>
  </div>
  )
}

export default JobPostCard