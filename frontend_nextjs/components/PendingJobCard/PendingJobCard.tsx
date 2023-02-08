import React, { useContext, useState } from 'react';
// import googleLogo from 'assets/companies/googleLogo.png';
import { faBuilding, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext from 'app/AppContext';
import { AxiosError } from 'axios';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AuthenticationPayload, StudentDemographic, WorkingRights } from 'types/api';
import JobDescriptionModal from 'components/JobDescriptionModal/JobDescriptionModal';
import api from 'config/api';

type PendingJobCardProps = {
  company: string;
  location: string;
  id: number;
  role: string;
  description: string;
  applicationLink: string;
  expiry: string;
  isPaid: boolean;
  jobType: string;
  mode: string;
  workingRights: WorkingRights[];
  studentDemographic: StudentDemographic[];
  wamRequirements: string;
  additionalInfo: string;
  onSuccess(message: string): void;
  onError(message: string): void;
  onRemove(): void;
};

const PendingJobCard = ({
  company,
  location,
  id,
  role,
  description,
  applicationLink,
  expiry,
  isPaid,
  jobType,
  mode: jobMode,
  workingRights,
  studentDemographic,
  wamRequirements,
  additionalInfo,
  onSuccess,
  onError,
  onRemove
}: PendingJobCardProps) => {
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();
  const { apiToken, setApiToken } = useContext(AppContext);

  const approveJob = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await api.patch<AuthenticationPayload>(
        `/job/${id}/approve`,
        {},
        {
          headers: {
            Authorization: apiToken
          }
        }
      );
      setApiToken(res.data.token);
      onRemove();
      onSuccess('Job successfully approved!');
      onError('');
    } catch (err) {
      onError('Something went wrong. Please try again.');
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          onSuccess('');
          onError('Invalid user credentials. Redirecting to home page.');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      }
      window.scrollTo(0, 10);
    }
  };

  const rejectJob = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await api.patch<AuthenticationPayload>(
        `/job/${id}/reject`,
        {},
        {
          headers: {
            Authorization: apiToken
          }
        }
      );
      setApiToken(res.data.token);
      onRemove();
      onSuccess('Job successfully rejected!');
    } catch (err) {
      onError('Something went wrong. Please try again!');
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          onError('Invalid user credentials. Redirecting to home page.');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      }
    }
  };

  return (
    <div>
      <JobDescriptionModal
        open={openModal}
        role={role}
        description={description}
        applicationLink={applicationLink}
        expiry={expiry}
        isPaid={isPaid}
        jobType={jobType}
        jobMode={jobMode}
        workingRights={workingRights}
        studentDemographic={studentDemographic}
        wamRequirements={wamRequirements}
        additionalInfo={additionalInfo}
        onClose={() => setOpenModal(false)}
      />
      <br />
      <div>
        <button
          type="button"
          className="flex flex-row p-4 shadow-card rounded-md w-full sm:flex-wrap hover-anim bg-white"
          onClick={() => setOpenModal(true)}
        >
          {/* <!-- TODO: to be replaced with company logo --> */}
          {/* <Image
            src={googleLogo}
            className="h-auto max-w-[100px] max-h-[90px] mr-8 self-center"
            alt="job logo"
            width={100}
            height={100}
          /> */}
          <div className="flex flex-col text-left pt-3 grow min-w-[200px]">
            <h2 className="font-bold text-jb-headings">{role}</h2>
            <p>
              <FontAwesomeIcon icon={faBuilding} className="h-4 mr-1" />
              {company}
            </p>
            <p>
              <FontAwesomeIcon icon={faLocationDot} className="h-4 mr-1" />
              {location}
            </p>
          </div>
          <div className="sm:flex mx-auto">
            <button type="button" className="btn btn-green w-36 h-10 p-2 my-2" onClick={approveJob}>
              Approve
            </button>
            <button type="button" className="btn btn-red w-36 h-10 p-2 my-2" onClick={rejectJob}>
              Reject
            </button>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PendingJobCard;
