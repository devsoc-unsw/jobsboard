'use client';

import React, { useContext, useState } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppContext from 'app/AppContext';
import Alert from 'components/Alert/Alert';
import api from 'config/api';
import { AuthenticationPayload } from 'types/api';
import Button from 'ui/Button/Button';
import Input from 'ui/Input/Input';
import Label from 'ui/Label/Label';

const CompanyLoginPage = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const { setApiToken } = useContext(AppContext);

  const router = useRouter();

  const performLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post<AuthenticationPayload>('/authenticate/company', {
        username,
        password
      });
      setApiToken(res.data.token);
      setAlertOpen(false);
      router.push('/company/dashboard');
    } catch (e) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setAlertOpen(true);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="h-full flex flex-col justify-center items-center py-16">
        <h1 className="font-bold text-3xl text-jb-headings">Company Login</h1>
        <p className="text-lg text-jb-subheadings my-4 mx-[18%] sm:mx-8">
          Enter your email in the format example@company.com and your password.
        </p>

        {/* <!-- Error Alert --> */}
        <Alert
          type="error"
          message="Invalid credentials. Please try again."
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
        />

        <form className="flex justify-center items-center flex-col w-full">
          {/* <!-- Email Input --> */}
          <div className="w-2/5 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5">
            <Input
              name="email"
              type="text"
              required
              autoComplete="username"
              onChange={(value) => setUsername(value)}
              value={username}
              onKeyUp={(key) => key === 'Enter' && performLogin()}
            />
            <Label htmlFor="email">Email</Label>
          </div>

          {/* <!-- Password Input --> */}
          <div className="w-2/5 relative group mt-4 mb-6 xl:w-2/5 md:w-1/2 sm:w-4/5">
            <Input
              name="password"
              type={hidePassword ? 'password' : 'text'}
              required
              autoComplete="current-password"
              onChange={(value) => setPassword(value)}
              value={password}
              onKeyUp={(key) => key === 'Enter' && performLogin()}
            />
            <Label htmlFor="password">Password</Label>
            <FontAwesomeIcon
              icon={hidePassword ? faEyeSlash : faEye}
              className="text-jb-placeholder hover:text-black duration-500 cursor-pointer absolute right-[15px] top-1/2 -translate-y-1/2"
              onClick={() => setHidePassword((prevState) => !prevState)}
            />
          </div>
        </form>

        <p className="text-lg text-jb-subheadings text-center my-2">
          Not a company?&nbsp;
          <Link
            className="text-jb-textlink font-bold transition-colors duration-200 ease-linear
                  cursor-pointer hover:text-jb-textlink-hovered"
            href="/student/login"
          >
            Student Login
          </Link>
        </p>

        <p className="text-lg text-jb-subheadings text-center my-2">
          Forgot your password?&nbsp;
          <Link
            className="text-jb-textlink font-bold transition-colors duration-200 ease-linear
                      cursor-pointer hover:text-jb-textlink-hovered"
            href="/company/forgot"
          >
            Reset Your Password
          </Link>
        </p>
        <p className="text-lg text-jb-subheadings text-center my-2 mb-6">
          Don&apos;t have an account?&nbsp;
          <Link
            className="text-jb-textlink font-bold transition-colors duration-200 ease-linear
                cursor-pointer hover:text-jb-textlink-hovered"
            href="/company/signup"
          >
            Create one!
          </Link>
        </p>
        <Button variant="primary" onClick={performLogin} loading={loading}>
          Log In
        </Button>
      </div>
    </div>
  );
};

export default CompanyLoginPage;
