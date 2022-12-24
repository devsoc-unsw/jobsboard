"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppContext from 'app/AppContext'
import Alert from 'components/Alert/Alert'
import Loading from 'components/Loading/Loading'
import api from 'config/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import { AuthenticationPayload } from 'types/student'

const LoginStudentPage = () => {
  const [hidePassword, setHidePassword] = useState(true)
  const [zID, setZID] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const { setApiToken } = useContext(AppContext)

  const router = useRouter()

  const performLogin = async () => {
    setIsLoading(true)
    try {
      const res = await api.post<AuthenticationPayload>('/authenticate/student', {
          zID,
          password,
      })
      if (res.status === 200) {
        setApiToken(res.data.token);
        setAlertOpen(false)
        router.push('/jobs');
      }
    } catch(e) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setAlertOpen(true)
    }
    setIsLoading(false)
  };

  return (
    <div>
      <div className='h-full flex flex-col justify-center items-center py-16'>
    <h1 className='font-bold text-3xl text-jb-headings'>
      Student Login
    </h1>
    <p className='text-lg text-jb-subheadings my-4 mx-[18%] sm:mx-8'>
      Enter your zID in the format zXXXXXXX and your zPassword.
    </p>

    {/* <!-- Error Alert --> */}
    <Alert 
      type='error'
      message='Invalid credentials. Please try again.'
      open={alertOpen}
      onClose={() => setAlertOpen(false)}
    />
    <form className='flex justify-center items-center flex-col w-full'>
      {/* <!-- zId Input --> */}
      <div className='w-2/5 relative group mt-4 mb-6 md:w-1/2 sm:w-4/5'>
        <input
          id='zID'
          name='zID'
          type='text'
          className='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer'
          autoComplete='username'
          required
          onChange={(e) => setZID(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') performLogin()
          }}
        />
        <label
          htmlFor='zID'
          className='transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
        >
          zID
        </label>
      </div>

      {/* <!-- Password Input --> */}
      <div className='w-2/5 relative group mt-4 mb-6 md:w-1/2 sm:w-4/5'>
        <input
          id='password'
          name='password'
          type={hidePassword ? "password" : "text"}
          className='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer'
          autoComplete='current-password'
          required
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') performLogin()
          }}
        />
        <label
          htmlFor='password'
          className='transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
        >
          Password
        </label>
        <FontAwesomeIcon
          icon={hidePassword ? "eye-slash" : "eye"}
          className='text-jb-placeholder hover:text-black duration-500 cursor-pointer absolute right-[15px] top-1/2 -translate-y-1/2'
          onClick={() => setHidePassword(prevState => !prevState)}
        />
      </div>
    </form>

    <p className='text-lg text-jb-subheadings text-center'>
      Not a student?&nbsp;
      <Link
        className='text-jb-textlink font-bold transition-colors duration-200 ease-linear
                  cursor-pointer hover:text-jb-textlink-hovered'
        href='/login/company'
      >
        Company Login
      </Link>
    </p>
    {isLoading ? <Loading />: <button
      className='btn btn-blue-filled w-40 h-11 my-4 p-2'
      onClick={performLogin}
    >
      Log In
    </button>}
  </div></div>
  )
}

export default LoginStudentPage