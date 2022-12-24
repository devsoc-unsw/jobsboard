"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppContext from 'app/AppContext'
import BenefitCard from 'components/BenefitCard/BenefitCard'
import Loading from 'components/Loading/Loading'
import api from 'config/api'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import GoogleLogo from 'assets/companies/googleLogo.png';
import JobCard from 'components/JobCard/JobCard'
import ErrorBox from 'components/ErrorBox/ErrorBox'

const JobsPage = () => {
  const router = useRouter()
  const { apiToken } = useContext(AppContext)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [jobs, setJobs] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [loadMoreJobsLock, setLoadMoreJobsLock] = useState(false);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMoreJobs = async () => {
      const sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
      };
    
      while (loadMoreJobsLock) {
        await sleep(1000);
      }

      setLoadMoreJobsLock(true)
    
      // determine whether there is an API key present and redirect if not present
      // load the jobs using the api token
      const res = await api.get(`/jobs/${jobs.length}`, {
        headers: {
          Authorization: apiToken
        },
      })
      setLoading(false)
      
      if (res.status == 200) {
        setJobs((prevState) => [...prevState, ...res.data.jobs])
      } else {
        setError(true)
        window.scrollTo(0, 10);
        if (res.status == 401) {
          setErrorMsg('Login expired. Redirecting to login page.')
          setTimeout(() => {
            router.push('/login/company');
          }, 3000);
        } else {
          setErrorMsg('Unable to load jobs at this time. Please try again later.')
        }
        setJobs([])
      }

      setLoadMoreJobsLock(false)
    };
  
    loadMoreJobs();
  }, [])

  const getValue = (object: any, path: string): any => {
    if (!path) return object;
    const properties = path.split('.');
    const indexKey = properties.shift() || '';
    return getValue(object[indexKey], properties.join('.'));
  };

  const searchKeys = ['role', 'jobType', 'company.name', 'company.location', 'mode'];
  const filteredJobs = jobs.filter(job => {
    return searchKeys.some(key => {
      return getValue(job, key).toLowerCase().includes(query);
    });
  })
  

  return (
    <div>
      {error &&
        <ErrorBox>
          {errorMsg}
        </ErrorBox>
      }
      <div className='max-w-4xl m-auto px-6'>
    <h3 className='text-xl text-left'>
      Still struggling to find a job...
    </h3>
    <h1 className='text-3xl my-2 font-bold text-jb-headings text-left'>
      Explore Our Curated List of Jobs
    </h1>
    <h3 className='text-xl my-3 mb-8 text-left'>
      We know that finding a job can be tough sometimes.
      Which is why we&apos;ve partnered up with only the best
      companies to bring you the best opportunities.
    </h3>
    <div className='flex justify-between items-stretch md:flex-col md:items-center mb-8'>
      <BenefitCard
        title='All jobs are paid'
        description='Student&apos;s welfare is always our
          top priority, which is why we ensure that
          all jobs that you see here are paid.'
        icon='money-bills'
      />
      <BenefitCard
        title='Complete Transparency'
        description='We aim to give you as much information
          as possible about the job upfront like whether or
          not a job is suitable for an international student.'
        icon='code'
      />
      <BenefitCard
        title='Amazing Partners'
        description='Our Careers team work round the clock to
          partner up with amazing companies in order to provide
          you with the best selection of jobs.'
        icon='people-group'
      />
    </div>

    <div className='flex items-center my-8 justify-between sm:flex-wrap sm:justify-center'>
      <div className='flex items-center sm:mb-4'>
        <FontAwesomeIcon icon='clipboard' />
        <p className='ml-2 font-bold'>
          {filteredJobs.length} Jobs Found
        </p>
      </div>
      <div className='relative'>
        <FontAwesomeIcon
          icon='magnifying-glass'
          className='flex absolute inset-y-0 my-auto left-0 items-center pl-3 pointer-events-none'
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type='text'
          placeholder='Search'
          className='border border-gray-300 block p-2 pl-10 w-56 rounded-md'
        />
      </div>
    </div>
  </div>
  <div className='max-w-6xl m-auto px-6'>
    {loading && <Loading />}
    <div className='flex flex-wrap justify-center'>
      <div className='flex flex-wrap sm:justify-center'>
        {
          filteredJobs.map((job) => 
            <JobCard
              key={job.key}
              jobID={job.id}
              imagePath={GoogleLogo}
              jobTitle={job.company.name}
              jobRole={job.role}
              jobType={job.jobType}
              jobTag={job.workingRights}
              jobLocation={job.company.location}
              jobMode={job.mode}
            />
          )
        }
      </div>
      {
        filteredJobs.length === 0 && !loading && <div
        className='max-w-4xl my-16 px-6 text-center'
      >
        <h2 className='text-3xl my-2 font-bold text-jb-headings'>
          Sorry, it doesn&apos;t seem like we have any jobs right now
        </h2>
        <h3 className='text-xl my-6'>
          Jobs listed here are usually posted by the company itself. We do not post any jobs
          without the explicit approval of the company. Please ensure your search query is correct
          or check back soon.
        </h3>
      </div>
      }
    </div>
  </div></div>
  )
}

export default JobsPage