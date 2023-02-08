import React, { useContext } from 'react';
import AppContext from 'app/AppContext';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { AuthenticationPayload } from 'types/authentication';
import api from 'config/api';

type PendingCompanyCardProps = {
  name: string;
  location: string;
  logo: Buffer;
  id: number;
  onClick(): void;
  onAlert(type: string, msg: string): void;
  onRemove(): void;
};

const PendingCompanyCard = ({
  onClick,
  onRemove,
  onAlert,
  logo,
  name,
  location,
  id
}: PendingCompanyCardProps) => {
  const router = useRouter();
  const { apiToken, setApiToken } = useContext(AppContext);

  const verifyCompany = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await api.patch<AuthenticationPayload>(
        `/admin/company/${id}/verify`,
        {},
        {
          headers: {
            Authorization: apiToken
          }
        }
      );
      setApiToken(res.data.token);
      onAlert('success', 'Company verified!');
      onRemove();
    } catch (err) {
      onAlert('error', 'Error in processing verification. Please try again later.');
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

  console.log(logo);

  return (
    <div
      className="flex flex-col p-8 mb-8 shadow-card rounded-md w-[75%] transform transition duration-200 hover:scale-105 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-row items-center">
        {/* TODO!: fix logo */}
        {/* {logo && (
          <Image
            src=""
            src={'data:image/png;base64,' + Buffer.from(logo.data).toString('base64')}
            width={12}
            height={12}
            alt="company logo"
          ></Image>
        )} */}
        <div className="flex flex-col text-left w-full truncate">
          <h2 className="font-bold text-jb-headings text-xl truncate">{name}</h2>
          <h3 className="text-jb-subheadings text-lg truncate">{location}</h3>
        </div>
        <button
          type="button"
          className="bg-jb-accept-button rounded-md w-28 h-11 m-2 text-white font-bold text-base border-0 mb-0
              shadow-btn duration-200 ease-linear cursor-pointer hover:shadow-btn-hovered"
          onClick={verifyCompany}
        >
          Approve
        </button>
      </div>
    </div>
  );
};

export default PendingCompanyCard;
