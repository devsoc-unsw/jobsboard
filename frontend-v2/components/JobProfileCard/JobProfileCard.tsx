import { faCircleDollarToSlot, faLocationDot, faSuitcase, faTrashAlt, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext from 'app/AppContext';
import JobDescriptionModal from 'components/JobDescriptionModal/JobDescriptionModal'
import api from 'config/api';
import { JobMode, JobType } from 'constants/jobFields';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'

type Props = {
  jobID: number,
  role: string,
  pay: string,
  jobType: string,
  mode: string,
  expiry: string,
  description: string,
  applicationLink: string,
  workingRights: any[],
  studentDemographic: any[],
  wamRequirements: string,
  additionalInfo: string,
  listName: string,
}

/*
.box {
  background: linear-gradient(146deg, rgba(111, 179, 252, 0.4) 0%, rgba(254, 254, 254) 100%);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
}
.hover {
  color: white
}
.main_hover {
  background-color: #FF7060;
}
.boxHover {
  background: linear-gradient(146.05deg, #79B9FF 0%, rgba(255, 255, 255, 0) 100%);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
}
*/

const JobProfileCard = ({
  jobID,
  role,
  pay,
  jobType,
  mode,
  expiry,
  description,
  applicationLink,
  workingRights,
  studentDemographic,
  wamRequirements,
  additionalInfo,
  listName
}: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState('')

  const { apiToken } = useContext(AppContext)

  const router = useRouter()

  const jobTypeObject = JobType;
  const jobModeObject = JobMode;

  const closeJobModal = async () => {
    setOpenModal(false)
    setModalContent('')
  };

  const deleteJob = async () => {
    const res = await api.delete(`/company/job/${jobID}`, {
      headers: {
        Authorization: apiToken,
      }
    });
    if (res.status === 200 && listName === 'postedJobs') {
      closeJobModal();
    } else {
      if (res.status === 401) {
        setTimeout(() => {
          router.push('/login/company');
        }, 3000);
      }
    }
  };

  return (
    <div>
      <JobDescriptionModal
      open={openModal}
      title={role}
      description={description}
      applicationLink={applicationLink}
      expiryDate={expiry}
      isPaidPosition={pay}
      jobType={jobType}
      jobMode={mode}
      workingRights={workingRights}
      studentDemographic={studentDemographic}
      wamRequirements={wamRequirements}
      additionalInfo={additionalInfo}
      onClose={closeJobModal}
    />
    <div
      className='relative mt-6 ml-6 mb-8 box rounded-xl w-[190px] h-[230px] cursor-pointer px-6'
      onClick={() => setOpenModal(true)}
    >
      <div className='text-left'>
        <h1 className='font-bold text-xl text-[#1a324e] text-center leading-[60px] mb-[-6px] truncate'>
          {role}
        </h1>
        {/* <!-- Description --> */}
        <div className='flex'>
          <div>
            <div>
              <FontAwesomeIcon
                icon={faSuitcase}
                className='text-black'
                size='1x'
              />
            </div>
            <div>
              <FontAwesomeIcon
                icon={faLocationDot}
                className='text-black ml-0.5'
                size='1x'
              />
            </div>
            <div>
              <FontAwesomeIcon
                icon={faUserGroup}
                className='text-black'
                size='1x'
              />
            </div>
            <div>
              <FontAwesomeIcon
                icon={faCircleDollarToSlot}
                className='text-black'
                size='1x'
              />
            </div>
          </div>

          <div className='truncate'>
            <p className='ml-3 text-jb-subheadings truncate'>
              {jobTypeObject[jobType as keyof typeof JobType]}
            </p>
            <p className='ml-3 text-jb-subheadings truncate'>
              {jobModeObject[mode as keyof typeof JobMode]}
            </p>
            <p className='ml-3 text-jb-subheadings truncate'>
              {studentDemographic!.length === 2 ? "Penult & Final" : 'All Students'}
            </p>
            <p className='ml-3 text-jb-subheadings truncate'>
              {pay ? 'Paid' : 'Not Paid'}
            </p>
          </div>
        </div>

        <p className='text-[#1a324e] text-sm text-center mt-4'>
          Expiry Date: {new Date(expiry).toLocaleDateString()}
        </p>
      </div>
    {listName === 'postedJobs' && (<div
      className='w-[105px] h-[25px] mt-4 rounded-lg flex justify-center relative left-[70px] bottom-[65px] cursor-pointer'
      onClick={deleteJob}
    >
      <div>
        <FontAwesomeIcon
          icon={faTrashAlt}
          className='text-[#FF7060]'
          size='1x'
        />
      </div>
      <div>
        <p
          className='font-bold text-[#FF7060] text-[15px] ml-1 mb-0.5'
        >
          Remove Job
        </p>
      </div>
    </div>)}
    </div>
  </div>
  )
}

export default JobProfileCard