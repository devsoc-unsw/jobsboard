'use client';
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
import AppContext from 'app/AppContext';
import Alert from 'components/Alert/Alert';
import JobListingMinimal from 'components/JobListingMinimal/JobListingMinimal';
import api from 'config/api';
import {
  JobMode,
  JobType,
  WamRequirements,
  WorkingRights as WR,
  StudentDemographic as SD
} from 'constants/jobFields';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { CompanyJob, HiddenJob } from 'types/api';

type Props = {
  params: {
    jobID: string;
  };
};

const JobInfoPage = ({ params }: Props) => {
  const jobID = params.jobID;

  // const [companyID, setCompanyID] = useState('')
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  // const [companyDescription, setCompanyDescription] = useState('')
  const [description, setDescription] = useState('');
  const [jobs, setJobs] = useState<(CompanyJob | HiddenJob)[]>([]);
  const [location, setLocation] = useState('');
  const [applicationLink, setApplicationLink] = useState('');
  const [jobMode, setJobMode] = useState('hybrid');
  const [studentDemographic, setStudentDemographic] = useState([]);
  const [jobType, setJobType] = useState('intern');
  const [workingRights, setWorkingRights] = useState([]);

  const [wamRequirements, setWamRequirements] = useState('none');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isPaid, setIsPaid] = useState(true);
  const [expiryDate, setExpiryDate] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  // const [jobInfoReady, setJobInfoReady] = useState(false)
  const [isJobDescriptionShown, setIsJobDescriptionShown] = useState(true);

  const router = useRouter();
  const { apiToken } = useContext(AppContext);

  const fetchJob = async () => {
    // determine whether there is an API key present and redirect if not present
    if (!apiToken) {
      router.push('/student/login');
      return;
    }

    // load the jobs using the api token
    const res = await api.get(`/job/${jobID}`, {
      headers: {
        Authorization: apiToken
      }
    });

    if (res.status === 200) {
      const job = res.data.job;

      setRole(job.role);
      setCompany(job.company.name);
      setDescription(job.description);
      // setCompanyDescription(job.company.description)
      setLocation(job.company.location);
      // setCompanyID(job.company.id)
      setApplicationLink(job.applicationLink);
      setJobMode(job.mode);
      setStudentDemographic(job.studentDemographic);
      setJobType(job.jobType);
      setWorkingRights(job.workingRights);
      setAdditionalInfo(
        job.additionalInfo || 'This company has not provided any additional information.'
      );
      setWamRequirements(job.wamRequirements);
      setIsPaid(job.isPaid);
      setExpiryDate(job.expiry);
    } else {
      setAlertOpen(true);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      if (res.status === 401) {
        setAlertMsg('Login expired. Redirecting to login page.');
        setTimeout(() => {
          router.push('/company/login');
        }, 3000);
      } else {
        setAlertMsg('Unable to load jobs at this time. Please try again later.');
      }
    }

    const jobRes = await api.get(`/company/${res.data.job.company.id}/jobs`, {
      headers: {
        Authorization: apiToken
      }
    });
    console.log({ jobRes });

    if (jobRes.status === 200) {
      // TODO(ad-t): Fix below, as it will always be true
      const updatedJobs = jobRes.data.companyJobs.filter((job: any) => {
        const jobResultID = parseInt(job.id, 10);
        const currentJobID = parseInt(jobID as string, 10);
        return jobResultID !== currentJobID;
      });
      setJobs(updatedJobs);
    } else {
      setAlertOpen(true);
      setAlertMsg('Unable to load company jobs at this time. Please try again later.');
    }

    // setJobInfoReady(true)
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

  console.log({ workingRights });

  return (
    <div>
      <Alert type="error" message={alertMsg} open={alertOpen} onClose={() => setAlertOpen(false)} />
      <div className="flex flex-row justify-center h-screen mb-10">
        <div className="flex flex-col py-4 px-2 h-full bg-white rounded-lg mr-4 w-1/4 overflow-y-auto shadow-card sm:hidden">
          <h2
            className={`font-bold text-xl text-jb-headings ${
              jobs.length === 0 ? 'my-auto' : 'mb-4'
            }`}
          >
            {jobs.length === 0
              ? 'There are no other jobs from this company.'
              : 'Other jobs from this company'}
          </h2>
          <div>
            {jobs.map((job) => (
              <JobListingMinimal
                key={job.id}
                jobID={job.id}
                role={job.role}
                company={company}
                location={location}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center w-3/4 h-full sm:w-full">
          <div className="flex flex-row p-4 bg-white rounded-2xl mb-4 w-full shadow-card md:flex-col">
            <div className="flex flex-col mr-8 self-center">
              {/* <!-- TODO: to be replaced with company logo --> */}
              <FontAwesomeIcon icon={faBuilding} size="10x" className="mb-2" />
              <button
                className="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0
              shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
                onClick={() => {
                  window.open(applicationLink, '_blank');
                }}
              >
                Apply
              </button>
            </div>
            <div className="flex flex-col text-left">
              <h1 className="font-bold text-3xl my-4 text-jb-headings">{role}</h1>
              <span className="mb-1">
                <FontAwesomeIcon icon={faBuilding} className="mr-2 w-7" />
                <b>Company:</b> {company}
              </span>
              <span className="mb-1">
                <FontAwesomeIcon icon={faLocationDot} className="mr-2 w-7" />
                <b>Location:</b> {location}
              </span>
              <span className="mb-1">
                <FontAwesomeIcon icon={faSuitcase} className="mr-2 w-7" />
                <b>Job Mode:</b> {JobMode[jobMode as keyof typeof JobMode]}
              </span>
              <span className="mb-1">
                <FontAwesomeIcon icon={faSuitcase} className="mr-2 w-7" />
                <b>Job Type:</b> {JobType[jobType as keyof typeof JobType]}
              </span>
              <span className="mb-1">
                <FontAwesomeIcon icon={faCalendar} className="mr-2 w-7" />
                <b>Expiry Date:</b> {new Date(expiryDate).toLocaleString().split(',')[0]}
              </span>
              <span className="mb-1">
                <FontAwesomeIcon icon={faCircleDollarToSlot} className="mr-2 w-7" />
                <b>Is this a paid position?</b> {isPaid ? 'Yes' : 'No'}
              </span>
              <span className="mb-1">
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2 w-7" />
                <b>Required WAM:&nbsp;</b>
                {WamRequirements[wamRequirements as keyof typeof WamRequirements]}
              </span>
              <span className="mb-1">
                <FontAwesomeIcon icon={faAddressCard} className="mr-2 w-7" />
                <b>
                  {['all'].every((val, idx) => val === workingRights[idx])
                    ? 'No required working rights specified for this job listing.'
                    : 'Must have one of the following working rights in Australia:'}
                </b>
                {!['all'].every((val, idx) => val === workingRights[idx]) && (
                  <ul className="list-disc list-inside ml-12">
                    {workingRights.map((r) => (
                      <li key={r}>{WR[r as keyof typeof WR]}</li>
                    ))}
                  </ul>
                )}
              </span>
              <span className="mb-1">
                <FontAwesomeIcon icon={faUser} className="mr-2 w-7" />
                <b>
                  {['all'].every((val, idx) => val === studentDemographic[idx])
                    ? 'This job listing is open to students at any stage of their degree.'
                    : 'This job listing is open to only the following students:'}
                </b>
                {!['all'].every((val, idx) => val === studentDemographic[idx]) && (
                  <ul className="list-disc list-inside ml-12">
                    {studentDemographic.map((s) => (
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
                __html: isJobDescriptionShown ? description : additionalInfo
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobInfoPage;
