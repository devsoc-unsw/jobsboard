'use client';

import React, { useContext, useState } from 'react';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosError } from 'axios';
import AppContext from 'contexts/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert, { AlertType } from 'components/Alert/Alert';
import api from 'config/api';
import base64 from 'config/base64';
import Button from 'ui/Button/Button';
import Input from 'ui/Input/Input';
import Label from 'ui/Label/Label';

const CompanySignupPage = () => {
  const router = useRouter();
  const { apiToken } = useContext(AppContext);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>('error');
  const [alertMsg, setAlertMsg] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const updateLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const uploadLogo = e.target.files[0];
      setLogo(uploadLogo);
      setPreview(URL.createObjectURL(uploadLogo));
    }
  };

  const validateInput = () => {
    if (!name || !location || !logo) {
      setAlertOpen(true);
      setAlertType('error');
      setAlertMsg('One or more fields are empty. Please try again');
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
    const convertedFile = await base64(logo);
    try {
      await api.put(
        '/admin/company',
        {
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
      setAlertMsg('Company account created successfully! Redirecting to admin dashboard...');
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 2000);
    } catch (e) {
      setAlertOpen(true);
      setAlertType('error');
      setAlertMsg('Invalid company name address. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center py-16">
      <h1 className="font-bold text-3xl text-jb-headings my-4">Create Company</h1>

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
      <form className="w-2/5 sm:w-1/2 md:w-3/5 xl:w-1/2">
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
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
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

      <Button variant="primary" onClick={performSignup} loading={loading}>
        Create
      </Button>
    </div>
  );
};

export default CompanySignupPage;
