'use client';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext from 'app/AppContext';
import Alert, { AlertType } from 'components/Alert/Alert';
import Loading from 'components/Loading/Loading';
import api from 'config/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';

const CompanySignupPage = () => {
  const router = useRouter();
  const { apiToken } = useContext(AppContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>('error');
  const [alertMsg, setAlertMsg] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [logo, setLogo] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toBase64 = (file: any) => {
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

  const validateInput = () => {
    if (
      username === '' ||
      password === '' ||
      confirmPassword === '' ||
      name === '' ||
      location === '' ||
      logo === ''
    ) {
      setAlertOpen(true);
      setAlertType('error');
      setAlertMsg('One or more fields are empty. Please try again');
      return false;
    } else if (!username.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
      setAlertOpen(true);
      setAlertType('error');
      setAlertMsg('Please enter a valid email address');
      return false;
    } else if (password !== confirmPassword) {
      setAlertOpen(true);
      setAlertType('error');
      setAlertMsg('Passwords do not match. Please try again');
      return false;
    }
    return true;
  };

  const performSignup = async () => {
    setIsLoading(true);
    if (!validateInput()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsLoading(false);
      return;
    }
    const convertedFile = await toBase64(logo);
    const res = await api.put(
      '/company',
      {
        username,
        password,
        name,
        location,
        logo: convertedFile
      },
      {
        headers: {
          Authorization: apiToken
        }
      }
    );

    if (res.status === 200) {
      setAlertOpen(true);
      setAlertType('success');
      setAlertMsg('Company account created successfully! Redirecting to the login page...');
      setTimeout(() => {
        router.push('/login/company');
      }, 5000);
    } else if (res.status === 409) {
      setAlertOpen(true);
      setAlertType('error');
      setAlertMsg('There already exists a company with this email. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAlertOpen(true);
      setAlertType('error');
      setAlertMsg('Invalid email address. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center py-16">
      <h1 className="font-bold text-3xl text-jb-headings my-4">Company Sign Up</h1>

      {/* <!-- Disclaimer Box --> */}
      {!alertOpen && (
        <div className="h-full flex flex-col justify-center items-center mb-6">
          <div className="w-3/5 xs:w-2/3 sm:w-3/4 md:w-4/5 xl:5/6">
            <div className="bg-orange-100 border-t-4 border-orange-500 rounded-b px-5 py-4 shadow-md lg:mx-[15%] my-4">
              <div className="flex">
                <div className="py-1">
                  <FontAwesomeIcon icon={faCircleInfo} size="lg" />
                </div>
                <div className="mx-[2%] text-left break-words overflow-hidden">
                  <p className="font-bold text-lg sm:text-lg">Important note before signing up</p>
                  <p className="text-lg sm:text-base">
                    We recommend using a generic email alias rather than an individualised company
                    email, e.g. recruiting@company.com.au rather than
                    firstname.lastname@company.com.au
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <!-- Success/Error Alert --> */}
      {alertOpen && (
        <div>
          <Alert
            type={alertType}
            message={alertMsg}
            open={alertOpen}
            onClose={() => setAlertOpen(false)}
          />
        </div>
      )}
      <form className="w-2/5 sm:w-1/2 md:w-2/5 xl:w-1/4">
        <div className="relative group mt-4 mb-8">
          <input
            id="username"
            name="username"
            autoComplete="username"
            type="text"
            className="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer"
            required
            onKeyUp={(e) => {
              if (e.key === 'Enter') performSignup();
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label
            htmlFor="username"
            className="transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                  group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                  group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                  peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink"
          >
            Email
          </label>
        </div>

        {/* <!-- Password Input --> */}
        <div className="relative group mt-4 mb-8">
          <input
            id="password"
            name="password"
            autoComplete="new-password"
            type="password"
            className="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer"
            required
            onKeyUp={(e) => {
              if (e.key === 'Enter') performSignup();
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            htmlFor="password"
            className="transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                  group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                  group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                  peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink"
          >
            Password
          </label>
        </div>

        {/* <!-- Confirm Password Input --> */}
        <div className="group relative mt-4 mb-8">
          <input
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            type="password"
            className="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer"
            required
            onKeyUp={(e) => {
              if (e.key === 'Enter') performSignup();
            }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label
            htmlFor="confirmPassword"
            className="transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                  group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                  group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                  peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink"
          >
            Confirm Password
          </label>
        </div>

        {/* <!-- Company Name Input --> */}
        <div className="relative group mt-4 mb-8">
          <input
            id="name"
            name="name"
            type="text"
            className="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer"
            required
            onKeyUp={(e) => {
              if (e.key === 'Enter') performSignup();
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label
            htmlFor="name"
            className="transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                  group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                  group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                  peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink"
          >
            Company Name
          </label>
        </div>

        {/* <!-- Company Location Input --> */}
        <div className="relative group mt-4 mb-8">
          <input
            id="location"
            name="location"
            type="text"
            className="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink sm:w-full peer"
            required
            onKeyUp={(e) => {
              if (e.key === 'Enter') performSignup();
            }}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <label
            htmlFor="location"
            className="transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                  group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                  group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                  peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink"
          >
            Location
          </label>
        </div>

        {/* <!-- Company Logo Input --> */}
        <div className="relative group mt-4 mb-6">
          <div className="mt-1 flex justify-center rounded-md border-4 border-dashed border-gray-300 hover:bg-gray-100 bg-white px-6 pt-5 pb-6 shadow-btn">
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="logo"
                  className="relative cursor-pointer rounded-md font-medium text-jb-textlink font-bold transition-colors duration-200 ease-linear hover:text-jb-textlink-hovered"
                >
                  {logo ? (
                    <img className="w-16 md:w-32 lg:w-48" src={preview} />
                  ) : (
                    <div>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <p className="text-lg font-bold justify-center">
                        {logo ? logo.name : 'Upload logo'}
                      </p>
                    </div>
                  )}
                  <input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    className="hidden"
                    required
                    onChange={updateLogo}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>

      <p className="text-lg text-jb-subheadings text-center">
        Already have an account?&nbsp;
        <Link
          className="text-jb-textlink font-bold transition-colors duration-200 ease-linear
                    cursor-pointer hover:text-jb-textlink-hovered"
          href="/login/company"
        >
          Company Login
        </Link>
      </p>
      {isLoading ? (
        <Loading />
      ) : (
        <button
          type="submit"
          className="bg-jb-textlink rounded-md w-40 h-11 my-4 p-2 text-white font-bold text-base
               border-0 shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered"
          onClick={performSignup}
        >
          Sign Up
        </button>
      )}
    </div>
  );
};

export default CompanySignupPage;
