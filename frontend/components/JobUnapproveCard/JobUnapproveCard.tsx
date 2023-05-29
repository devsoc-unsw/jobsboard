import React, { useContext, useState } from 'react';
import { AxiosError } from 'axios';
import AppContext from 'contexts/AppContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from 'config/api';
import { AuthenticationPayload, StudentDemographic, WorkingRights } from 'types/api';
import JobUnapproveModal from 'components/JobUnapproveModal/JobUnapproveModal';

type JobUnapproveCardProps = {
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
  onClick(): void;
};

const JobUnapproveCard = ({
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
  onRemove,
  onClick
}: JobUnapproveCardProps) => {
  const router = useRouter();
  const name: string = 'hello';
  const { apiToken, setApiToken } = useContext(AppContext);

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const unverifyCompany = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await api.patch<AuthenticationPayload>(
        `/job/${id}/unapprove`,
        {},
        {
          headers: {
            Authorization: apiToken
          }
        }
      );
      setApiToken(res.data.token);
      onRemove();
      onSuccess('Job successfully unapproved!');
      onError('');
    } catch (err) {
      onError('Something went wrong. Please try again.');
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          onError(
            'Invalid user credentials. Redirecting to home page');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      }
    }
  };

  return (
    <>
      <JobUnapproveModal
        open={openConfirmationModal}
        role={role}
        company={company}
        onConfirm={unverifyCompany}
        onCancel={() => setOpenConfirmationModal(false)}
      />

      <div
        className="flex flex-col p-8 mb-8 shadow-card rounded-md w-[75%] transform transition duration-200 hover:scale-105 cursor-pointer bg-white"
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-row items-center">
          <div className="flex flex-col text-left w-full truncate">
            <h2 className="font-bold text-jb-headings text-xl truncate">{name}</h2>
            <h3 className="text-jb-subheadings text-lg truncate">{location}</h3>
          </div>
          <button
            type="button"
            className="bg-red-500 rounded-md w-28 h-11 m-2 text-white font-bold text-base border-0 mb-0
              shadow-btn duration-200 ease-linear cursor-pointer hover:shadow-btn-hovered"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setOpenConfirmationModal(true);
            }}
          >
            Unapprove
          </button>
        </div>
      </div>
    </>
  );
};

export default JobUnapproveCard;