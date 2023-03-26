import React, { useContext, useState } from 'react';
import { AxiosError } from 'axios';
import AppContext from 'contexts/AppContext';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from 'config/api';
import { AuthenticationPayload } from 'types/api';

type VerifiedCompanyCardProps = {
  name: string;
  location: string;
  id: number;
  onAlert(type: string, msg: string): void;
  onRemove(): void;
};

type ConfirmUnverifyModalProps = {
  open: boolean;
  name: string;
  onConfirm(e: React.MouseEvent<HTMLButtonElement>): void;
  onCancel(): void;
};

const ConfirmUnverifyModal = ({ open, name, onConfirm, onCancel }: ConfirmUnverifyModalProps) => {
  return open ? (
    <div>
      {/* <!-- Modal backdrop --> */}
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
      {/* <!-- Modal --> */}
      <div
        tabIndex={-1}
        className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative p-4 w-1/2 mx-auto max-w-full">
          {/* <!-- Modal content --> */}
          <div className="relative rounded-lg bg-white text-jb-subheadings">
            {/* <!-- Modal header --> */}
            <div className="flex flex-col justify-between items-left p-5 rounded-t border-b border-gray-600">
              <h2 className="text-xl text-left mb-4 text-jb-headings font-bold">{name}</h2>
            </div>
            {/* <!-- Modal body --> */}
            <div className="flex w-full p-6">
              <div className="text-lg font-medium text-left">
                Confirm unverification of
                <span className="text-jb-textlink font-bold"> {name}</span>? Keep in mind that this
                action cannot be undone.
              </div>
            </div>
            {/* <!-- Modal footer --> */}
            <div className="flex flex-row justify-between p-6 space-x-2 rounded-b border-t border-gray-600">
              <div>
                <button
                  type="button"
                  className="bg-jb-textlink rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-jb-textlink rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
                  onClick={onConfirm}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

const VerifiedCompanyCard = ({
  onRemove,
  onAlert,
  name,
  location,
  id
}: VerifiedCompanyCardProps) => {
  const router = useRouter();
  const { apiToken, setApiToken } = useContext(AppContext);

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const unverifyCompany = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await api.patch<AuthenticationPayload>(
        `/admin/company/${id}/unverify`,
        {},
        {
          headers: {
            Authorization: apiToken
          }
        }
      );
      setApiToken(res.data.token);
      onAlert('success', 'Company unverified!');
      setOpenConfirmationModal(false);
      onRemove();
    } catch (err) {
      onAlert('error', 'Error in processing unverification. Please try again later.');
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          onAlert(
            'error',
            'You are not authorized to perform this action. Redirecting to home page.'
          );
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      }
    }
  };

  return (
    <>
      <ConfirmUnverifyModal
        open={openConfirmationModal}
        name={name}
        onConfirm={unverifyCompany}
        onCancel={() => setOpenConfirmationModal(false)}
      />

      <div
        className="flex flex-col p-8 mb-8 shadow-card rounded-md w-[75%] transform transition duration-200 hover:scale-105 cursor-pointer bg-white"
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-row items-center">
          {/* {logo && <Image src={logo} width={12} height={12} alt={name} />} */}
          <div className="flex flex-col text-left w-full truncate">
            <h2 className="font-bold text-jb-headings text-xl truncate">{name}</h2>
            {/* <h3 className="text-jb-subheadings text-lg truncate">{username}</h3> */}
            <h3 className="text-jb-subheadings text-lg truncate">{location}</h3>
          </div>
          <button
            type="button"
            className="bg-red-500 rounded-md w-28 h-11 m-2 text-white font-bold text-base border-0 mb-0
              shadow-btn duration-200 ease-linear cursor-pointer hover:shadow-btn-hovered"
            // onClick={() => setOpenConfirmationModal(true)}
            onClick={unverifyCompany}
          >
            Unverify
          </button>
        </div>
      </div>
    </>
  );
};

export default VerifiedCompanyCard;
