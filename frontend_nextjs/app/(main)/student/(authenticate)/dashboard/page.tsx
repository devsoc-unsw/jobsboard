'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext from 'app/AppContext';
import BenefitCard from 'components/BenefitCard/BenefitCard';
import Spinner from 'ui/Spinner/Spinner';
import api from 'config/api';
import React, { useContext, useEffect, useState } from 'react';
import JobCard from 'components/JobCard/JobCard';
import ErrorBox from 'components/ErrorBox/ErrorBox';
import {
  faClipboard,
  faCode,
  faMagnifyingGlass,
  faMoneyBills,
  faPeopleGroup
} from '@fortawesome/free-solid-svg-icons';

const StudentDashboardPage = () => {
  const { apiToken } = useContext(AppContext);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      // determine whether there is an API key present and redirect if not present
      // load the jobs using the api token
      try {
        const res = await api.get(`/jobs/${jobs.length}`, {
          headers: {
            Authorization: apiToken
          }
        });

        setJobs(res.data.jobs);
      } catch (e) {
        setErrorMsg('Unable to load jobs at this time. Please try again later.');
        setError(true);
        window.scrollTo(0, 10);
      }
      setLoading(false);
    };

    getJobs();
  }, []);

  const getValue = (object: any, path: string): any => {
    if (!path) return object;
    const properties = path.split('.');
    const indexKey = properties.shift() || '';
    return getValue(object[indexKey], properties.join('.'));
  };

  const searchKeys = ['role', 'jobType', 'company.name', 'company.location', 'mode'];
  const filteredJobs = jobs.filter((job) => {
    return searchKeys.some((key) => {
      return getValue(job, key).toLowerCase().includes(query);
    });
  });

  return (
    <div>
      {error && <ErrorBox>{errorMsg}</ErrorBox>}
      <div>
        <h3 className="text-xl text-left">Still struggling to find a job...</h3>
        <h1 className="text-3xl my-2 font-bold text-jb-headings text-left">
          Explore Our Curated List of Jobs
        </h1>
        <h3 className="text-xl my-3 mb-8 text-left">
          We know that finding a job can be tough sometimes. Which is why we&apos;ve partnered up
          with only the best companies to bring you the best opportunities.
        </h3>
        <div className="flex justify-between items-stretch md:flex-col md:items-center mb-8">
          <BenefitCard
            title="All jobs are paid"
            description="Student's welfare is always our
          top priority, which is why we ensure that
          all jobs that you see here are paid."
            icon={faMoneyBills}
          />
          <BenefitCard
            title="Complete Transparency"
            description="We aim to give you as much information
          as possible about the job upfront like whether or
          not a job is suitable for an international student."
            icon={faCode}
          />
          <BenefitCard
            title="Amazing Partners"
            description="Our Careers team work round the clock to
          partner up with amazing companies in order to provide
          you with the best selection of jobs."
            icon={faPeopleGroup}
          />
        </div>

        <div className="flex items-center my-8 justify-between sm:flex-wrap sm:justify-center">
          <div className="flex items-center sm:mb-4">
            <FontAwesomeIcon icon={faClipboard} />
            <p className="ml-2 font-bold">{filteredJobs.length} Jobs Found</p>
          </div>
          <div className="relative">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="flex absolute inset-y-0 my-auto left-0 items-center pl-3 pointer-events-none"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search"
              className="border border-gray-300 block p-2 pl-10 w-56 rounded-md"
            />
          </div>
        </div>
      </div>
      <div>
        {loading && <Spinner />}
        <div className="flex flex-wrap justify-center">
          <div className="flex flex-wrap justify-center gap-7">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.key}
                jobID={job.id}
                jobLogo={job.logo}
                jobTitle={job.company.name}
                jobRole={job.role}
                jobType={job.jobType}
                jobTag={job.workingRights}
                jobLocation={job.company.location}
                jobMode={job.mode}
              />
            ))}
          </div>
          {filteredJobs.length === 0 && !loading && (
            <div className="max-w-4xl my-16 px-6 text-center">
              <h2 className="text-3xl my-2 font-bold text-jb-headings">
                Sorry, it doesn&apos;t seem like we have any jobs right now
              </h2>
              <h3 className="text-xl my-6">
                Jobs listed here are usually posted by the company itself. We do not post any jobs
                without the explicit approval of the company. Please ensure your search query is
                correct or check back soon.
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
