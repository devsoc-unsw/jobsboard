'use client';

import React, { useContext, useEffect, useState } from 'react';
import { faClock, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosError } from 'axios';
import AppContext from 'contexts/AppContext';
import { useRouter } from 'next/navigation';
import PendingCompanyCard from 'components/PendingCompanyCard/PendingCompanyCard';
import Tabs from 'components/Tabs/Tabs';
import Toast, { ToastType } from 'components/Toast/Toast';
import VerifiedCompanyCard from 'components/VerifiedCompanyCard/VerifiedCompanyCard';
import api from 'config/api';
import { AdminCompaniesPayload, AdminCompany, AdminPendingCompaniesPayload } from 'types/api';

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
  const [currCompany, setCurrCompany] = useState<AdminCompany | null>(null);
  const [unverifiedCompanies, setUnverifiedCompanies] = useState<AdminCompany[]>([]);
  const [verifiedCompanies, setVerifiedCompanies] = useState<AdminCompany[]>([]);

  const handleAlert = (type: ToastType, msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
    setTimeout(() => {
      setToastOpen(false);
    }, 3000);
  };

  const handleShowModal = (pendingCompany: AdminCompany) => {
    setCurrCompany(pendingCompany);
    setOpenModal(true);
  };

  useEffect(() => {
    const fetchPendingCompanies = async () => {
      try {
        const res = await api.get<AdminPendingCompaniesPayload>(`/admin/pending/companies`, {
          headers: {
            Authorization: apiToken
          }
        });

        setApiToken(res.data.token);
        setUnverifiedCompanies(
          res.data.pendingCompanyVerifications.map((pendingCompany) => ({
            id: pendingCompany.id,
            location: pendingCompany.company.location,
            username: pendingCompany.username,
            name: pendingCompany.company.name,
            description: pendingCompany.company.description,
            createdAt: pendingCompany.company.createdAt,
            logo: pendingCompany.company.logo
          }))
        );
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

    const fetchVerifiedCompanies = async () => {
      try {
        const res = await api.get<AdminCompaniesPayload>(`/admin/companies`, {
          headers: {
            Authorization: apiToken
          }
        });

        setVerifiedCompanies(res.data.companies);
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

    fetchPendingCompanies();
    fetchVerifiedCompanies();
  }, []);

  return (
    <div>
      {toastOpen && <Toast message={toastMsg} type={toastType} />}
      {currCompany && (
        <PendingCompanyModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          location={currCompany.location}
          username={currCompany.username}
          name={currCompany.name}
          description={currCompany.description}
          createdAt={currCompany.createdAt}
        />
      )}

      <Tabs>
        <div className="flex flex-col px-8 items-center" title="Pending Companies">
          <h1 className="text-jb-headings font-bold text-3xl mt-10 mb-4">
            Pending Company Verifications
          </h1>
          <p className="text-jb-subheadings mb-12">
            There {unverifiedCompanies.length === 1 ? 'is' : 'are'}
            &nbsp;currently {unverifiedCompanies.length} pending verification(s).
          </p>
          {unverifiedCompanies.map((company) => (
            <PendingCompanyCard
              key={company.id}
              id={company.id}
              username={company.username}
              name={company.name}
              location={company.location}
              logo={company.logo}
              onClick={() => handleShowModal(company)}
              onAlert={handleAlert}
              onRemove={() => {
                const verifiedCompany = unverifiedCompanies.find(
                  (c) => c.id === company.id
                ) as AdminCompany;
                setVerifiedCompanies([...verifiedCompanies, verifiedCompany]);
                setUnverifiedCompanies((prevState) => prevState.filter((c) => c.id !== company.id));
              }}
            />
          ))}
        </div>

        <div className="flex flex-col px-8 items-center" title="Verified Companies">
          <h1 className="text-jb-headings font-bold text-3xl mt-10 mb-4">
            Already Verified Companies
          </h1>
          <p className="text-jb-subheadings mb-12">
            There {verifiedCompanies.length === 1 ? 'is' : 'are'}
            &nbsp;currently {verifiedCompanies.length} verified company(s).
          </p>
          {verifiedCompanies.map((company) => (
            <VerifiedCompanyCard
              key={company.id}
              id={company.id}
              username={company.username}
              name={company.name}
              location={company.location}
              logo={company.logo}
              onClick={() => handleShowModal(company)}
              onAlert={handleAlert}
              onRemove={() => {
                const unverifiedCompany = verifiedCompanies.find(
                  (c) => c.id === company.id
                ) as AdminCompany;
                setUnverifiedCompanies([...unverifiedCompanies, unverifiedCompany]);
                setVerifiedCompanies((prevState) => prevState.filter((c) => c.id !== company.id));
              }}
            />
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default AdminCompanyPage;
