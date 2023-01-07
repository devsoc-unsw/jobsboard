'use client';
import { faBars, faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext from 'app/AppContext';
import JobBoard from 'components/JobBoard/JobBoard';
import api from 'config/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { CompanyJob, CompanyJobsPayload, HiddenJob, HiddenJobsPayload } from 'types/api';

const CompanyHomePage = () => {
  const router = useRouter();
  const { apiToken } = useContext(AppContext);

  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [expiredJobs, setExpiredJobs] = useState<HiddenJob[]>([]);
  const [boardStatus, setBoardStatus] = useState('postedJobs');
  const [openModal, setOpenModal] = useState(false);
  const [logo, setLogo] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);

  const getCompanyJobs = async () => {
    const res = await api.get<CompanyJobsPayload>('/companyjobs', {
      headers: {
        Authorization: apiToken
      }
    });

    if (res.status === 200) {
      setJobs(res.data.companyJobs);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const toBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const updateLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadLogo = e.target.files![0];
    setLogo(uploadLogo);
    setPreview(URL.createObjectURL(uploadLogo));
  };

  const checkCompanyLogoStatus = async () => {
    const res = await api.get('/company/logo/status', {
      headers: {
        Authorization: apiToken
      }
    });

    if (res.status !== 200) {
      setOpenModal(true);
    }
  };

  const uploadLogo = async () => {
    if (!logo.value) {
      return;
    }

    const convertedFile = await toBase64(logo.value);
    await api.put(
      '/company/update/logo',
      {
        logo: convertedFile
      },
      {
        headers: {
          Authorization: apiToken
        }
      }
    );
    setOpenModal(false);
  };

  const getHiddenJobs = async () => {
    const res = await api.get<HiddenJobsPayload>('/job/company/hidden', {
      headers: {
        Authorization: apiToken
      }
    });

    if (res.status === 200) {
      setExpiredJobs(res.data.hiddenJobs);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      if (res.status === 401) {
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      }
    }
  };

  useEffect(() => {
    getCompanyJobs();
    getHiddenJobs();
    checkCompanyLogoStatus();
  }, []);

  return (
    <div>
      {openModal && (
        <div>
          {/* <!-- Modal backdrop --> */}
          <div className="opacity-25 fixed inset-0 z-40 bg-black" />
          {/* <!-- Modal --> */}
          <div
            tabIndex={-1}
            className="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none flex justify-center items-center"
          >
            <div className="relative p-4 w-1/2 mx-auto max-w-full">
              {/* <!-- Modal content --> */}
              <div className="relative rounded-lg bg-white">
                {/* <!-- Modal header --> */}
                <div className="flex justify-between items-center p-5 rounded-t border-gray-600">
                  <h2 className="text-xl font-medium text-jb-subheader">
                    Looks like there isn&apos;t a company logo associated with this account.
                  </h2>
                </div>
                {/* <!-- Modal body --> */}
                <div className="flex justify-center items-center w-full p-6">
                  <label className="flex flex-col justify-center items-center w-full h-64 rounded-lg border-2 border-dashed cursor-pointer bg-white border-gray-600 hover:border-gray-500 hover:bg-gray-100">
                    {logo ? (
                      <Image alt="preview logo" width={100} height={100} src={preview} />
                    ) : (
                      <div className="flex flex-col justify-center items-center pt-5 pb-6">
                        <FontAwesomeIcon
                          icon={faCloudUpload}
                          className="text-jb-subheader mb-4"
                          size="3x"
                        />
                        <p className="mb-2 text-sm">{logo || 'Click to upload an image'}</p>
                      </div>
                    )}
                    <input
                      accept=".jpg, .png"
                      type="file"
                      className="hidden"
                      onChange={updateLogo}
                    />
                  </label>
                </div>
                {/* <!-- Modal footer --> */}
                <div className="flex flex-row justify-end p-6 space-x-2 rounded-b border-gray-600">
                  <button
                    className="bg-red-600 rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-red-700 hover:shadow-md-hovered"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-jb-textlink rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
                    onClick={uploadLogo}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="px-[10%]">
        <h1 className="font-bold text-5xl text-jb-headings text-center leading-[72px] m-0 mt-4">
          Welcome Back! &nbsp;👋
        </h1>
        <p className="text-lg text-jb-subheadings text-center">
          Accelerate your search for talented job applicants today with us!
        </p>

        <div className="w-[700px] m-auto mt-8">
          {/* <!-- Board select dropdown --> */}
          <div className="text-left flex ml-2">
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
            <div>
              <select
                id="board"
                onChange={(e) => setBoardStatus(e.target.value)}
                name="boards"
                className="bg-[#F6F9FC] ml-4 font-bold text-lg"
              >
                <option value="postedJobs">Posted Jobs</option>
                <option value="expiredJobs ">Expired Jobs</option>
              </select>
            </div>
          </div>
        </div>
        {/* <!-- Board --> */}
        <JobBoard
          jobList={boardStatus === 'postedJobs' ? jobs : expiredJobs}
          listName={boardStatus}
        />

        <h1 className="font-bold text-4xl text-jb-headings text-center leading-[72px] mt-14">
          Curious about our other Partners?
        </h1>
        <p className="text-lg text-jb-subheadings mb-8 text-center">
          Check out our other&nbsp;
          <a href="https://www.csesoc.unsw.edu.au/sponsors" target="__blank">
            <span className="text-jb-textlink font-bold transition-colors duration-200 ease-linear cursor-pointer hover:text-jb-textlink-hovered">
              sponsors
            </span>
            .
          </a>
        </p>
      </div>
    </div>
  );
};

export default CompanyHomePage;
