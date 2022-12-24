"use client"
import AppContext from 'app/AppContext';
import Loading from 'components/Loading/Loading';
import PendingJobCard from 'components/PendingJobCard/PendingJobCard';
import Toast from 'components/Toast/Toast';
import api from 'config/api';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

const AdminJobsPage = () => {
  const router = useRouter();
  const { apiToken, setApiToken } = useContext(AppContext)
  const [loading, setLoading] = useState(true)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await api.get('/admin/jobs/pending', {
        headers: {
          Authorization: apiToken,
        },
      })

      if (res.status === 200) {
        setApiToken(res.data.token)
        setJobs(res.data.pendingJobs)
      } else {
        window.scrollTo(0, 10);
        if (res.status == 401) {
          setErrorMsg('You are not authorized to perform this action. Redirecting to login page.')
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setErrorMsg('Failed to get pending jobs.')
        }
      }

      setLoading(false)
    }

    fetchJobs()
  }, [])

  const onSuccess = (message: string) => {
    setSuccessMsg(message)
    setTimeout(() => setSuccessMsg(''), 3000);
  };
  const onError = (message: string) => {
    setErrorMsg(message)
    setTimeout(() => setErrorMsg(''), 3000);
  };

  return (
    <div className='w-11/12 max-w-2xl mx-auto text-center'>
      {successMsg + errorMsg !== "" && <Toast
        message={successMsg || errorMsg}
        type={successMsg ? 'success': 'error'}
      />}
        <h1 className='text-3xl text-jb-headings font-bold mt-0 mb-2 md:mt-10'>
          Pending Job Requests
        </h1>
        <h3
          className='text-base text-jb-subheadings'
        >
          {jobs.length} Pending {jobs.length === 1 ? 'Job': 'Jobs'}
        </h3>
        {loading && <Loading />}
        {jobs.map(job => <PendingJobCard
          key={job.key}
          company={job.company.name}
          location={job.company.location}
          jobID={job.id}
          role={job.role}
          description={job.description}
          applicationLink={job.applicationLink}
          expiryDate={job.expiry}
          isPaidPosition={job.isPaid}
          jobType={job.jobType}
          jobMode={job.mode}
          workingRights={job.workingRights}
          studentDemographic={job.studentDemographic}
          wamRequirements={job.wamRequirements}
          additionalInfo={job.additionalInfo}
          onSuccess={onSuccess}
          onError={onError}
          onRemove={() => setJobs((prevState) => prevState.filter(j => j.id !== job.id))}
        />)}
      </div>
  )
}

export default AdminJobsPage