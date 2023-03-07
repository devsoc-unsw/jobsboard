'use client';

import React, { useContext, useEffect, useState } from 'react';
import {
  faAddressCard,
  faBuilding,
  faCalendar,
  faCircleDollarToSlot,
  faGraduationCap,
  faLocationDot,
  faSuitcase,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext from 'contexts/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert from 'components/Alert/Alert';
import JobListingMinimal from 'components/JobListingMinimal/JobListingMinimal';
import api from 'config/api';
import {
  JobMode,
  JobType,
  StudentDemographic as SD,
  WamRequirements,
  WorkingRights as WR
} from 'constants/jobFields';
import { CompanyJobsPayload, Job, JobPayload, JobWithCompany } from 'types/api';
import Button from 'ui/Button/Button';
import Spinner from 'ui/Spinner/Spinner';

type StudentJobPageProps = {
  params: {
    jobID: string;
  };
};

const StudentJobPage = ({ params }: StudentJobPageProps) => {
  const { jobID } = params;

  const [job, setJob] = useState<JobWithCompany | null>(null);
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);

  const [alertMsg, setAlertMsg] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [isJobDescriptionShown, setIsJobDescriptionShown] = useState(true);

  const router = useRouter();
  const { apiToken } = useContext(AppContext);

  const fetchJob = async () => {
    // determine whether there is an API key present and redirect if not present
    if (!apiToken) {
      router.push('/student/login');
      return;
    }

    try {
      const res = await api.get<JobPayload>(`/job/${jobID}`, {
        headers: {
          Authorization: apiToken
        }
      });
      const jobInfo = res.data.job;
      setJob(jobInfo);

      const companyJobsRes = await api.get<CompanyJobsPayload>(
        `/company/${jobInfo.company.id}/jobs`,
        {
          headers: {
            Authorization: apiToken
          }
        }
      );

      const otherCompanyJobs = companyJobsRes.data.companyJobs.filter(
        (companyJob) => companyJob.id !== parseInt(jobID, 10)
      );
      setCompanyJobs(otherCompanyJobs);
    } catch (e) {
      setAlertMsg('Unable to load jobs at this time. Please try again later.');
      setAlertOpen(true);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    fetchJob();

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  }, []);

  return (
    <div>
      {job ? (
        <>
          <Alert
            type="error"
            message={alertMsg}
            open={alertOpen}
            onClose={() => setAlertOpen(false)}
          />
          <div className="flex flex-row justify-center h-screen mb-10">
            <div className="flex flex-col py-4 px-2 h-full bg-white rounded-lg mr-4 w-1/4 overflow-y-auto shadow-card sm:hidden">
              <h2
                className={`font-bold text-xl text-jb-headings ${
                  companyJobs.length === 0 ? 'my-auto' : 'mb-4'
                }`}
              >
                {companyJobs.length === 0
                  ? 'There are no other jobs from this company.'
                  : 'Other jobs from this company'}
              </h2>
              <div>
                {companyJobs.map((companyJob) => (
                  <JobListingMinimal
                    key={companyJob.id}
                    id={companyJob.id}
                    role={companyJob.role}
                    company={job.company.name}
                    location={job.company.location}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center w-3/4 h-full sm:w-full">
              <div className="flex flex-row p-4 gap-8 bg-white rounded-2xl mb-4 w-full shadow-card md:flex-col">
                <div className="flex flex-col justify-center items-center gap-4">
                  {job.company.logo ? (
                    <Image width={300} height={300} src={job.company.logo} alt={job.company.name} />
                  ) : (
                    <FontAwesomeIcon icon={faBuilding} size="8x" className="mb-2" />
                  )}
                  <Link href={job.applicationLink} target="_blank" rel="noreferrer">
                    <Button variant="primary">Apply</Button>
                  </Link>
                </div>
                <div className="flex flex-col text-left">
                  <h1 className="font-bold text-3xl my-4 text-jb-headings">{job.role}</h1>
                  <span className="mb-1">
                    <FontAwesomeIcon icon={faBuilding} className="mr-2 w-7" />
                    <b>Company:</b> {job.company.name}
                  </span>
                  <span className="mb-1">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-2 w-7" />
                    <b>Location:</b> {job.company.location}
                  </span>
                  <span className="mb-1">
                    <FontAwesomeIcon icon={faSuitcase} className="mr-2 w-7" />
                    <b>Job Mode:</b> {JobMode[job.mode as keyof typeof JobMode]}
                  </span>
                  <span className="mb-1">
                    <FontAwesomeIcon icon={faSuitcase} className="mr-2 w-7" />
                    <b>Job Type:</b> {JobType[job.jobType as keyof typeof JobType]}
                  </span>
                  <span className="mb-1">
                    <FontAwesomeIcon icon={faCalendar} className="mr-2 w-7" />
                    <b>Expiry Date:</b> {new Date(job.expiry).toLocaleString().split(',')[0]}
                  </span>
                  <span className="mb-1">
                    <FontAwesomeIcon icon={faCircleDollarToSlot} className="mr-2 w-7" />
                    <b>Is this a paid position?</b> {job.isPaid ? 'Yes' : 'No'}
                  </span>
                  <span className="mb-1">
                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2 w-7" />
                    <b>Required WAM:&nbsp;</b>
                    {WamRequirements[job.wamRequirements as keyof typeof WamRequirements]}
                  </span>
                  <span className="mb-1">
                    <FontAwesomeIcon icon={faAddressCard} className="mr-2 w-7" />
                    <b>
                      {['all'].every((val, idx) => val === job.workingRights[idx])
                        ? 'No required working rights specified for this job listing.'
                        : 'Must have one of the following working rights in Australia:'}
                    </b>
                    {!['all'].every((val, idx) => val === job.workingRights[idx]) && (
                      <ul className="list-disc list-inside ml-12">
                        {job.workingRights.map((r) => (
                          <li key={r}>{WR[r as keyof typeof WR]}</li>
                        ))}
                      </ul>
                    )}
                  </span>
                  <span className="mb-1">
                    <FontAwesomeIcon icon={faUser} className="mr-2 w-7" />
                    <b>
                      {['all'].every((val, idx) => val === job.studentDemographic[idx])
                        ? 'This job listing is open to students at any stage of their degree.'
                        : 'This job listing is open to only the following students:'}
                    </b>
                    {!['all'].every((val, idx) => val === job.studentDemographic[idx]) && (
                      <ul className="list-disc list-inside ml-12">
                        {job.studentDemographic.map((s) => (
                          <li key={s}>{SD[s as keyof typeof SD]}</li>
                        ))}
                      </ul>
                    )}
                  </span>
                </div>
              </div>
              <div className="w-full">
                <ul className="flex -mb-px justify-start list-inside list-none">
                  <li className="mr-2">
                    <button
                      type="button"
                      className={`inline-block p-4 ${
                        isJobDescriptionShown
                          ? 'text-jb-textlink font-black'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setIsJobDescriptionShown(true)}
                    >
                      Description
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      type="button"
                      className={`inline-block p-4 ${
                        !isJobDescriptionShown
                          ? 'text-jb-textlink font-black'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setIsJobDescriptionShown(false)}
                    >
                      Additional Information
                    </button>
                  </li>
                </ul>
              </div>
              <div className="text-left h-full p-4 bg-white rounded-2xl w-full overflow-y-auto shadow-card">
                <p
                  dangerouslySetInnerHTML={{
                    __html: isJobDescriptionShown ? job.description : job.additionalInfo
                  }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default StudentJobPage;
