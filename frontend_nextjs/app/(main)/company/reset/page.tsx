'use client';
import AppContext from 'app/AppContext';
import Alert, { AlertType } from 'components/Alert/Alert';
import Loading from 'components/Loading/Loading';
import api from 'config/api';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';

const ResetPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertType, setAlertType] = useState<AlertType>('error');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const { apiToken } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const performCompanyPasswordReset = async () => {
    setIsLoading(true);
    if (newPassword.length === 0) {
      setAlertType('error');
      setAlertMsg('Your new password can not be empty.');
      setAlertOpen(true);
    } else if (newPassword !== confirmPassword) {
      setAlertType('error');
      setAlertMsg('Passwords do not match. Please try again.');
      setAlertOpen(true);
    } else {
      const res = await api.put(
        '/company/password-reset',
        {
          newPassword
        },
        {
          headers: {
            Authorization: apiToken
          }
        }
      );

      if (res.status === 200) {
        window.scrollTo(0, 10);
        setAlertType('success');
        setAlertMsg(
          'Your password has been successfully been reset. Redirecting you to the login page...'
        );
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/login');
        }, 5000);
      } else {
        window.scrollTo(0, 10);
        setAlertType('success');
        setAlertOpen(true);
        if (res.status === 400) {
          setAlertMsg('Please try again. Password reset failed.');
        } else if (res.status === 401) {
          setAlertMsg('Token may be invalid or expired. Redirecting to login page.');
          setTimeout(() => {
            router.push('/login/company');
          }, 3000);
        } else {
          setAlertMsg('There was an error when trying to reset your password. Please try again.');
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center py-16">
      <h1 className="text-jb-headings font-bold text-3xl">Reset Your Password</h1>
      <p className="text-jb-subheadings text-base my-4 mx-[18%] sm:mx-8">
        Please enter your new password.
      </p>

      {/* <!-- Success/Error Alert --> */}
      <Alert
        type={alertType}
        message={alertMsg}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />

      {/* <!-- New Password Input --> */}
      <div className="w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5">
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          className="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && performCompanyPasswordReset()}
        />
        <label
          htmlFor="newPassword"
          className="transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                 group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                 group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                 peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink"
        >
          New Password
        </label>
      </div>

      {/* <!-- Confirm Password Input --> */}
      <div className="w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5">
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && performCompanyPasswordReset()}
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
      {isLoading ? (
        <Loading />
      ) : (
        <button
          className="btn btn-blue-filled w-40 h-11 my-4 p-2"
          onClick={performCompanyPasswordReset}
        >
          Reset Password
        </button>
      )}
    </div>
  );
};

export default ResetPage;
