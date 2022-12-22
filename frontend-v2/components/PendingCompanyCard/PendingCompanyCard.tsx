import AppContext from 'app/AppContext';
import api from 'config/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'

type Props = {
  companyName: string,
  location: string,
  description: string,
  logo: string,
  companyAccountID: string,
  onClick(): void,
  onAlert(type: string, msg: string): void
  onRemove(): void
}

const PendingCompanyCard = ({ onClick, onRemove, onAlert, logo, companyName, location, companyAccountID }: Props) => {
  const router = useRouter();
  const { apiToken, setApiToken } = useContext(AppContext)

  const verifyCompany = async (e) => {
    e.stopPropagation()
    const res = await api.patch(`/admin/company/${companyAccountID}/verify`, {
      headers: {
        Authorization: apiToken,
      },
    })

    if (res.status === 200) {
      setApiToken(res.data.token)
      onAlert('success', 'Company verified!')
      onRemove()
    } else {
      if (res.status === 401) {
        onAlert('error', 'You are not authorized to perform this action. Redirecting to login page.')
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        onAlert('error', 'Error in processing verification. Please try again later.')
      }
    }
  };

  return (
    <div
    className='flex flex-col p-8 mb-8 shadow-card rounded-md w-[75%] transform transition duration-200 hover:scale-105 cursor-pointer'
    onClick={onClick}
  >
    <div className='flex flex-row items-center'>
      {logo && <Image
        className='h-12'
        src={logo}
        alt='company logo'
      ></Image>}
      <div className='flex flex-col text-left w-full truncate'>
        <h2 className='font-bold text-jb-headings text-xl truncate'>
          {companyName}
        </h2>
        <h3 className='text-jb-subheadings text-lg truncate'>
          {location}
        </h3>
      </div>
      <button
        className='bg-jb-accept-button rounded-md w-28 h-11 m-2 text-white font-bold text-base border-0 mb-0
              shadow-btn duration-200 ease-linear cursor-pointer hover:shadow-btn-hovered'
        onClick={verifyCompany}
      >
        Approve
      </button>
    </div>
  </div>
  )
}

export default PendingCompanyCard