'use client';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext from 'app/AppContext';
import PendingCompanyCard from 'components/PendingCompanyCard/PendingCompanyCard';
import Toast, { ToastType } from 'components/Toast/Toast';
import api from 'config/api';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

const AdminCompanyPage = () => {
  const { apiToken, setApiToken } = useContext(AppContext);

  const router = useRouter();
  const [toastType, setToastType] = useState<ToastType>('success');
  const [toastMsg, setToastMsg] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [currentCompanyShown, setCurrentCompanyShown] = useState('');
  const [currentCompanyLocation, setCurrentCompanyLocation] = useState('');
  const [currentCompanyDescription, setCurrentCompanyDescription] = useState('');

  const [companies, setCompanies] = useState<any[]>([]);

  const triggerAlert = (type: ToastType, msg: string) => {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
    setTimeout(() => {
      setToastOpen(false);
    }, 3000);
  };

  const triggerModal = (companyName: string, location: string, companyDescription: string) => {
    setOpenModal(true);
    setCurrentCompanyShown(companyName);
    setCurrentCompanyLocation(location);
    setCurrentCompanyDescription(companyDescription);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await api.get(`/admin/pending/companies`, {
        headers: {
          Authorization: apiToken
        }
      });

      if (res.status === 200) {
        setApiToken(res.data.token);
        setCompanies(res.data.pendingCompanyVerifications);
      } else {
        setToastType('error');
        if (res.status === 401) {
          setToastMsg('You are not authorized to perform this action. Redirecting to login page.');
          setToastOpen(true);
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setToastMsg('Failed to get pending companies.');
          setToastOpen(true);
        }
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div>
      {toastOpen && <Toast message={toastMsg} type={toastType} />}
      {openModal && (
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
                  <h2 className="text-xl text-left mb-4 text-jb-headings font-bold">
                    {currentCompanyShown}
                  </h2>
                  <div className="flex flex-row items-center">
                    <FontAwesomeIcon icon={faLocationDot} className="h-4 mr-4" />
                    <h3 className="text-lg font-medium text-left">{currentCompanyLocation}</h3>
                  </div>
                </div>
                {/* <!-- Modal body --> */}
                <div className="flex w-full p-6">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: currentCompanyDescription
                    }}
                  />
                </div>
                {/* <!-- Modal footer --> */}
                <div className="flex flex-row justify-end p-6 space-x-2 rounded-b border-t border-gray-600">
                  <button
                    className="bg-jb-textlink rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
                    onClick={() => setOpenModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            companyAccountID={company.id}
            companyName={company.company.name}
            location={company.company.location}
            description={company.company.description}
            logo={company.company.logo}
            onClick={() =>
              triggerModal(
                company.company.name,
                company.company.location,
                company.company.description
              )
            }
            onAlert={triggerAlert}
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
