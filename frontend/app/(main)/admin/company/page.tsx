'use client';

import React, { useContext, useEffect, useState } from 'react';
import { faClock, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import AppContext from 'app/AppContext';
import PendingCompanyCard from 'components/PendingCompanyCard/PendingCompanyCard';
import Toast, { ToastType } from 'components/Toast/Toast';
import api from 'config/api';
import { AdminPendingCompaniesPayload, AdminPendingCompany } from 'types/api';

type PendingCompanyModalProps = {
  location: string;
  username: string;
  name: string;
  description: string;
  createdAt: string;
  open: boolean;
  onClose(): void;
};

const PendingCompanyModal = ({
  location,
  username,
  name,
  description,
  createdAt,
  open,
  onClose
}: PendingCompanyModalProps) => {
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
              <div className="flex flex-row items-center">
                <FontAwesomeIcon icon={faUser} className="h-4 mr-4" />
                <h3 className="text-lg font-medium text-left">{username}</h3>
              </div>
              <div className="flex flex-row items-center">
                <FontAwesomeIcon icon={faLocationDot} className="h-4 mr-4" />
                <h3 className="text-lg font-medium text-left">{location}</h3>
              </div>
              <div className="flex flex-row items-center">
                <FontAwesomeIcon icon={faClock} className="h-4 mr-4" />
                <h3 className="text-lg font-medium text-left">{createdAt}</h3>
              </div>
            </div>
            {/* <!-- Modal body --> */}
            <div className="flex w-full p-6">
              <p
                dangerouslySetInnerHTML={{
                  __html: description || ''
                }}
              />
            </div>
            {/* <!-- Modal footer --> */}
            <div className="flex flex-row justify-end p-6 space-x-2 rounded-b border-t border-gray-600">
              <button
                type="button"
                className="bg-jb-textlink rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

const AdminCompanyPage = () => {
  const { apiToken, setApiToken } = useContext(AppContext);

  const router = useRouter();
  const [toastType, setToastType] = useState<ToastType>('success');
  const [toastMsg, setToastMsg] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [currCompany, setCurrCompany] = useState<AdminPendingCompany | null>(null);
  const [companies, setCompanies] = useState<AdminPendingCompany[]>([]);

  const handleAlert = (type: ToastType, msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
    setTimeout(() => {
      setToastOpen(false);
    }, 3000);
  };

  const handleShowModal = (pendingCompany: AdminPendingCompany) => {
    setCurrCompany(pendingCompany);
    setOpenModal(true);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get<AdminPendingCompaniesPayload>(`/admin/pending/companies`, {
          headers: {
            Authorization: apiToken
          }
        });

        setApiToken(res.data.token);
        setCompanies(res.data.pendingCompanyVerifications);
      } catch (e) {
        setToastType('error');
        setToastMsg('Failed to get pending companies.');
        setToastOpen(true);
        if (e instanceof AxiosError) {
          if (e.response?.status === 401) {
            setToastMsg('You are not authorized to perform this action. Redirecting to home page.');
            setTimeout(() => {
              router.push('/');
            }, 3000);
          }
        }
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div>
      {toastOpen && <Toast message={toastMsg} type={toastType} />}
      {currCompany && (
        <PendingCompanyModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          location={currCompany.company.location}
          username={currCompany.username}
          name={currCompany.company.name}
          description={currCompany.company.description}
          createdAt={currCompany.company.createdAt}
        />
      )}
      <div className="flex flex-col px-8 items-center">
        <h1 className="text-jb-headings font-bold text-3xl mt-10 mb-4">
          Pending Company Verifications
        </h1>
        <p className="text-jb-subheadings mb-12">
          There {companies.length === 1 ? 'is' : 'are'}
          &nbsp;currently {companies.length} pending verification(s).
        </p>
        {companies.map((company) => (
          <PendingCompanyCard
            key={company.id}
            id={company.id}
            username={company.username}
            name={company.company.name}
            location={company.company.location}
            logo={company.company.logo}
            onClick={() => handleShowModal(company)}
            onAlert={handleAlert}
            onRemove={() =>
              setCompanies((prevState) => prevState.filter((c) => c.id !== company.id))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default AdminCompanyPage;
