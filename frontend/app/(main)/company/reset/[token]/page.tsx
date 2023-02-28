'use client';

import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Alert, { AlertType } from 'components/Alert/Alert';
import api from 'config/api';
import Button from 'ui/Button/Button';
import Input from 'ui/Input/Input';
import Label from 'ui/Label/Label';

type CompanyResetPageProps = {
  params: {
    token: string;
  };
};

const CompanyResetPage = ({ params }: CompanyResetPageProps) => {
  const { token } = params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertType, setAlertType] = useState<AlertType>('error');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const performCompanyPasswordReset = async () => {
    setLoading(true);
    if (newPassword.length === 0) {
      setAlertType('error');
      setAlertMsg('Your new password can not be empty.');
      setAlertOpen(true);
    } else if (newPassword !== confirmPassword) {
      setAlertType('error');
      setAlertMsg('Passwords do not match. Please try again.');
      setAlertOpen(true);
    } else {
      try {
        await api.put(
          '/company/password-reset',
          {
            newPassword
          },
          {
            headers: {
              Authorization: token
            }
          }
        );

        window.scrollTo(0, 10);
        setAlertType('success');
        setAlertMsg(
          'Your password has been successfully been reset. Redirecting you to the login page...'
        );
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/company/login');
        }, 5000);
      } catch (e) {
        window.scrollTo(0, 10);
        setAlertType('error');
        setAlertMsg('There was an error when trying to reset your password. Please try again.');
        setAlertOpen(true);
        if (e instanceof AxiosError) {
          if (e.response?.status === 400) {
            setAlertMsg('Please try again. Password reset failed.');
          } else if (e.response?.status === 401) {
            setAlertMsg('Token may be invalid or expired. Redirecting to login page.');
            setTimeout(() => {
              router.push('/company/login');
            }, 3000);
          }
        }
      }
    }
    setLoading(false);
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
        <Input
          name="newPassword"
          type="password"
          required
          onChange={(value) => setNewPassword(value)}
          value={newPassword}
          onKeyUp={(key) => key === 'Enter' && performCompanyPasswordReset()}
        />
        <Label htmlFor="newPassword">New Password</Label>
      </div>

      {/* <!-- Confirm Password Input --> */}
      <div className="w-1/4 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5">
        <Input
          name="confirmPassword"
          type="password"
          required
          onChange={(value) => setConfirmPassword(value)}
          value={confirmPassword}
          onKeyUp={(key) => key === 'Enter' && performCompanyPasswordReset()}
        />
        <Label htmlFor="confirmPassword">Confirm Password</Label>
      </div>
      <Button variant="primary" onClick={performCompanyPasswordReset} loading={loading}>
        Reset Password
      </Button>
    </div>
  );
};

export default CompanyResetPage;
