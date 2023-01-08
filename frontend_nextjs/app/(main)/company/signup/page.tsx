'use client';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext from 'app/AppContext';
import { AxiosError } from 'axios';
import Alert, { AlertType } from 'components/Alert/Alert';
import Spinner from 'ui/Spinner/Spinner';
import api from 'config/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import Button from 'ui/Button/Button';
import Input from 'ui/Input/Input';
import Label from 'ui/Label/Label';
import Image from 'next/image';

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
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const toBase64 = (file: File) => {
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
    if (!username || !password || !confirmPassword || !name || !location || !logo) {
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
    setLoading(true);
    if (!validateInput() || !logo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);
      return;
    }
    const convertedFile = await toBase64(logo);
    try {
      await api.put(
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

      setAlertOpen(true);
      setAlertType('success');
      setAlertMsg('Company account created successfully! Redirecting to the login page...');
      setTimeout(() => {
        router.push('/company/login');
      }, 5000);
    } catch (e) {
      setAlertOpen(true);
      setAlertType('error');
      setAlertMsg('Invalid email address. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (e instanceof AxiosError) {
        if (e.response?.status === 409) {
          setAlertOpen(true);
          setAlertType('error');
          setAlertMsg('There already exists a company with this email. Please try again.');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
    setLoading(false);
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
          <Input
            name="email"
            type="text"
            required
            autoComplete="username"
            onChange={(value) => setUsername(value)}
            value={username}
            onKeyUp={(key) => key === 'Enter' && performSignup()}
          />
          <Label htmlFor="email">Email</Label>
        </div>

        {/* <!-- Password Input --> */}
        <div className="relative group mt-4 mb-8">
          <Input
            name="password"
            type="password"
            required
            autoComplete="new-password"
            onChange={(value) => setPassword(value)}
            value={password}
            onKeyUp={(key) => key === 'Enter' && performSignup()}
          />
          <Label htmlFor="password">Password</Label>
        </div>

        {/* <!-- Confirm Password Input --> */}
        <div className="group relative mt-4 mb-8">
          <Input
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            onChange={(value) => setConfirmPassword(value)}
            value={confirmPassword}
            onKeyUp={(key) => key === 'Enter' && performSignup()}
          />
          <Label htmlFor="confirmPassword">Confirm Password</Label>
        </div>

        {/* <!-- Company Name Input --> */}
        <div className="relative group mt-4 mb-8">
          <Input
            name="name"
            type="text"
            required
            onChange={(value) => setName(value)}
            value={name}
            onKeyUp={(key) => key === 'Enter' && performSignup()}
          />
          <Label htmlFor="name">Company Name</Label>
        </div>

        {/* <!-- Company Location Input --> */}
        <div className="relative group mt-4 mb-8">
          <Input
            name="location"
            type="text"
            required
            onChange={(value) => setLocation(value)}
            value={location}
            onKeyUp={(key) => key === 'Enter' && performSignup()}
          />
          <Label htmlFor="location">Location</Label>
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
                    <Image src={preview} alt="company logo" width={200} height={200} />
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
                      <p className="text-lg font-bold justify-center">Upload logo</p>
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

      <p className="text-lg text-jb-subheadings text-center mb-6">
        Already have an account?&nbsp;
        <Link
          className="text-jb-textlink font-bold transition-colors duration-200 ease-linear
                    cursor-pointer hover:text-jb-textlink-hovered"
          href="/company/login"
        >
          Company Login
        </Link>
      </p>
      {loading ? <Spinner /> : <Button onClick={performSignup}>Sign Up</Button>}
    </div>
  );
};

export default CompanySignupPage;
