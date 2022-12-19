"use client"
import Alert, { AlertType } from 'components/Alert/Alert'
import Loading from 'components/Loading/Loading'
import api from 'config/api'
import Link from 'next/link'
import React, { useState } from 'react'

const CompanyForgotPage = () => {
  const [email, setEmail] = useState('')
  const [alertType, setAlertType] = useState<AlertType>('error')
  const [alertMsg, setAlertMsg] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const performCompanyPasswordForgot = async () => {
    setIsLoading(true)
      const res = await api.post('/company/forgot-password', {
        username: email
      })
  
    if (res.status === 200) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setAlertType('success')
      setAlertOpen(true)
      setAlertMsg('An email will be sent shortly. Please check your inbox.')
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setAlertType('error')
      setAlertOpen(true)      
      if (res.status === 400) {
        setAlertMsg('Could not find a company account with that email. Please try again.')
      } else {
        setAlertMsg('Email failed to send. Please try again.')
      }
    }
    setIsLoading(false)
  };

  return (
    <div className='h-full flex flex-col justify-center items-center py-16 text-center'>
      <h1 className='text-jb-headings font-bold text-3xl'>
        Forgot Your Password?
      </h1>
      <p className='text-jb-subheadings text-base my-4 mx-8 sm:mx-[18%]'>
        Enter your email address in the format example@company.com. You will receive an email with instructions on how to reset your password.
      </p>

      {/* <!-- Success/Error Alert --> */}
      <Alert
        type={alertType}
        message={alertMsg}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />

      {/* <!-- Email Input --> */}
      <div className='w-1/4 relative group mt-4 mb-8 xl:w-2/5 md:w-1/2 sm:w-4/5'>
        <input
          id='email'
          v-model='email'
          name='email'
          type='text'
          className='font-bold border-l-4 border-jb-textlink rounded-md p-4 shadow-btn w-full text-lg focus:outline-jb-textlink peer'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && performCompanyPasswordForgot()}
        />
        <label
          htmlFor='email'
          className='transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                 group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                 group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                 peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink'
        >
          Email
        </label>
      </div>
      {isLoading ? <Loading /> : <button
        className='btn btn-blue-filled w-40 h-11 my-4 p-2'
        onClick={performCompanyPasswordForgot}
      >
        Forgot Password
      </button>
      }

      <div className='flex flex-row justify-evenly items-center pt-12 w-1/4 sm:flex-col xl:w-2/5 md:w-1/2'>
        <p className='flex flex-col text-jb-subheadings pb-0 sm:pb-4'>
          Not a company?
          <Link
            href='/login/student'
            className='text-jb-textlink font-bold'
          >
            Student Login
          </Link>
        </p>
        <p className='flex flex-col text-jb-subheadings'>
          Don&apos;t have an account?
          <Link
            href='/signup/company'
            className='text-jb-textlink font-bold'
          >
            Create One
          </Link>
        </p>
      </div>
    </div>
  )
}

export default CompanyForgotPage