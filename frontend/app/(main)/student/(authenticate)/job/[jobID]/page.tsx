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
import OtherJobs from 'components/OtherJobs/OtherJobs';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className="flex md:flex-col justify-center mb-10">
            <div className="flex flex-col md:flex-row md:items-center max-h-screen overflow-y-auto mr-6 sticky md:static top-6 self-start md:self-auto">
              {job.company.logo ? (
                <Image width={300} height={300} src={job.company.logo} alt={job.company.name} />
              ) : (
                <FontAwesomeIcon icon={faBuilding} size="8x" className="mb-2" />
              )}
              <div className="flex flex-col text-left text-sm w-auto md:w-3/5">
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
                  <b>Required working rights:&nbsp;</b>
                  {!['all'].every((val, idx) => val === job.workingRights[idx]) ? (
                    <ul className="list-disc ml-16">
                      {job.workingRights.map((r) => (
                        <li key={r}>{WR[r as keyof typeof WR]}</li>
                      ))}
                    </ul>
                  ) : (
                    <>None</>
                  )}
                </span>
                <span className="mb-1">
                  <FontAwesomeIcon icon={faUser} className="mr-2 w-7" />
                  <b>Preferred students:&nbsp;</b>
                  {['all'].every((val, idx) => val === job.studentDemographic[idx]) ? (
                    <ul className="list-disc list-inside ml-12">
                      {job.studentDemographic.map((s) => (
                        <li key={s}>{SD[s as keyof typeof SD]}</li>
                      ))}
                    </ul>
                  ) : (
                    <>None</>
                  )}
                </span>
                <Link
                  href={job.applicationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-center my-4"
                >
                  <Button variant="primary">
                    <b className="text-sm">Apply for this job</b>
                  </Button>
                </Link>
              </div>
              <OtherJobs className="md:hidden" job={job} companyJobs={companyJobs} />
            </div>
            <div className="flex flex-col w-3/4 md:w-full md:mb-4 ">
              <h1 className="font-bold text-3xl mb-4 text-jb-headings">{job.role}</h1>
              <h2 className="font-bold text-2xl my-4 text-jb-headings">Description</h2>
              {job.description ? (
                // eslint-disable-next-line react/no-danger
                <p dangerouslySetInnerHTML={{ __html: job.description }} />
              ) : (
                <p>This job has no description.</p>
              )}
              <h2 className="font-bold text-2xl my-4 text-jb-headings">Additional Information</h2>

              {job.additionalInfo ? (
                // eslint-disable-next-line react/no-danger
                <p dangerouslySetInnerHTML={{ __html: job.additionalInfo }} />
              ) : (
                <p>This job has no additional information.</p>
              )}
            </div>

            <OtherJobs className="hidden md:flex" job={job} companyJobs={companyJobs} />
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default StudentJobPage;
