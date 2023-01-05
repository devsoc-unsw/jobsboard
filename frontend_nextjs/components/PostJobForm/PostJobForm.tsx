'use client';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext from 'app/AppContext';
import Alert, { AlertType } from 'components/Alert/Alert';
import JobDescriptionModal from 'components/JobDescriptionModal/JobDescriptionModal';
import Loading from 'components/Loading/Loading';
import api from 'config/api';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { StudentDemographic, WorkingRights } from 'types/api';

type Props = {
  admin?: boolean;
};

const PostJobForm = ({ admin }: Props) => {
  const [openModal, setOpenModal] = useState(false);

  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [applicationLink, setApplicationLink] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isPaidPosition, setIsPaidPosition] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobMode, setJobMode] = useState('');
  const [workingRights, setWorkingRights] = useState<WorkingRights[]>([]);
  const [studentDemographic, setStudentDemographic] = useState<StudentDemographic[]>([]);
  const [wamRequirements, setWamRequirements] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [alertType, setAlertType] = useState<AlertType>('success');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [verifiedCompanies, setVerifiedCompanies] = useState<any>({});
  const [selectedCompanyID, setSelectedCompanyID] = useState('');
  const [loading, setLoading] = useState(false);

  const { apiToken, setApiToken } = useContext(AppContext);

  const router = useRouter();

  const modules = {
    toolbar: [
      [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
      [
        'bold',
        'italic',
        'underline',
        'strike',
        { script: 'sub' },
        { script: 'super' },
        'code-block',
        'link'
      ],
      [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }]
    ]
  };

  useEffect(() => {
    const setup = async () => {
      // make the call to get a list of verified companies to select from
      const res = await api.get('/admin/companies', {
        headers: {
          Authorization: apiToken
        }
      });

      if (res.status === 200) {
        // alphabetically sort them
        setVerifiedCompanies(
          res.data.companies.sort((companyA: any, companyB: any) => companyA.name > companyB.name)
        );
      } else {
        setAlertType('error');
        if (res.status === 401) {
          setAlertMsg('You are not authorized to perform this action. Redirecting to login page.');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setAlertMsg('Malformed request. Please contact the admin.');
        }
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };
    admin && setup();
  }, []);

  const submitJobPost = async () => {
    setLoading(true);
    if (
      (admin && !selectedCompanyID) ||
      !role.length ||
      !description.length ||
      !applicationLink.length ||
      !expiryDate.length ||
      !isPaidPosition.length ||
      !jobType.length ||
      !jobMode.length ||
      !workingRights.length ||
      !studentDemographic.length ||
      !wamRequirements.length
    ) {
      setAlertType('error');
      setAlertMsg('Missing one or more fields. Please ensure that all fields are filled.');
      setAlertOpen(true);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // create a date object using this value
    const jobDate = new Date(expiryDate);
    // set to the end of the set day
    jobDate.setHours(23);
    jobDate.setMinutes(59);

    // ensure that there is a selected company
    if (admin && (parseInt(selectedCompanyID, 10) < 0 || isNaN(parseInt(selectedCompanyID, 10)))) {
      // error message
      setAlertType('error');
      setAlertMsg('Please select a valid company.');
      setAlertOpen(true);
      setLoading(false);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    const apiEndpoint = admin ? `/admin/company/${selectedCompanyID}/jobs` : `/jobs`;

    const res = await api.put(
      apiEndpoint,
      {
        role,
        description,
        applicationLink,
        expiry: jobDate.valueOf(),
        isPaid: isPaidPosition,
        jobMode,
        studentDemographic,
        jobType,
        workingRights,
        wamRequirements,
        additionalInfo
      },
      {
        headers: {
          Authorization: apiToken
        }
      }
    );

    setApiToken(res.data.token);

    if (res.status === 200) {
      setAlertType('success');
      setAlertMsg(
        'Job posted! This job will be made available to students shortly. Redirecting to your dashboard...'
      );
      setAlertOpen(true);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setTimeout(() => {
        router.push(`/${admin ? 'admin' : 'company'}/home`);
      }, 5000);
    } else {
      setAlertType('error');
      if (res.status === 403) {
        setAlertMsg('Failed to post job request as this company has not been verified.');
      } else if (res.status === 401) {
        setAlertMsg('You are not authorized to perform this action. Redirecting to login page.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setAlertMsg(
          'Looks like something went wrong. Please ensure that all fields are filled with a valid value.'
        );
      }
      setAlertOpen(true);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    setLoading(false);
  };

  const handleOnChangeWorkingRights = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked)
      setWorkingRights((prevState) => [...prevState, e.target.value as WorkingRights]);
    else setWorkingRights((prevState) => prevState.filter((v) => v !== e.target.value));
  };

  const handleOnChangeStudentDemographic = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked)
      setStudentDemographic((prevState) => [...prevState, e.target.value as StudentDemographic]);
    else setStudentDemographic((prevState) => prevState.filter((v) => v !== e.target.value));
  };

  const handleOnChangeWamRequirements = (e: React.ChangeEvent<HTMLInputElement>) =>
    setWamRequirements(e.target.value);

  return (
    <div>
      <JobDescriptionModal
        open={openModal}
        title={role}
        description={description}
        applicationLink={applicationLink}
        expiryDate={expiryDate}
        isPaidPosition={isPaidPosition}
        jobType={jobType}
        jobMode={jobMode}
        workingRights={workingRights}
        studentDemographic={studentDemographic}
        wamRequirements={wamRequirements}
        additionalInfo={additionalInfo}
        onClose={() => setOpenModal(false)}
      />
      <div className="flex flex-col items-center w-4/5 mx-auto mb-10">
        {/* <!-- select company --> */}
        <h1 className="text-jb-headings font-bold text-3xl mt-0 lg:mt-10">Post a Job</h1>
        <p className="text-jb-subheadings mb-12">
          Reach out to a talented pool of over 10,000 Computer Science and Engineering students
        </p>
        {/* <!-- disclaimer box --> */}
        {!admin && !alertOpen && (
          <div className="bg-orange-100 border-t-4 border-orange-500 rounded-b px-4 py-3 shadow-md mx-[15%] lg:mx-0 mb-10">
            <div className="flex">
              <div className="py-1">
                <FontAwesomeIcon icon={faCircleInfo} size="lg" />
              </div>
              <div className="mx-[2%]">
                <p className="font-bold text-left text-xl">
                  Important note before making a job post
                </p>
                <p className="text-left">
                  Please understand that we will be cross checking this with the&nbsp;
                  <a
                    className="text-jb-textlink font-bold hover:text-jb-textlink-hovered"
                    href="https://www.fairwork.gov.au/starting-employment/unpaid-work/student-placements"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Australian Fair Work Act 2009
                  </a>
                  &nbsp;to determine whether the job post follows all guidelines and prioritises the
                  safety of our members.
                </p>
              </div>
            </div>
          </div>
        )}
        <Alert
          type={alertType}
          message={alertMsg}
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
        />
        {/* <!-- input fields --> */}
        {admin && (
          <div>
            <h2 className="text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center">
              Select Company
            </h2>
            <select
              value={selectedCompanyID}
              onChange={(e) => setSelectedCompanyID(e.target.value)}
              id="selectedCompany"
              name="selectedCompany"
              className="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink border-r-transparent border-r-8 bg-white"
            >
              <option value="" disabled selected>
                Please select an option
              </option>
              {Object.values(verifiedCompanies).map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name} - {company.location}
                </option>
              ))}
            </select>
          </div>
        )}
        <h2 className="text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center">
          Job Title
        </h2>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          name="role"
          type="text"
          placeholder="Job Title"
          className="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink"
        />
        <h2 className="text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center">
          Job Description
        </h2>
        <ReactQuill
          placeholder="Enter the job description..."
          modules={modules}
          value={description}
          onChange={(value) => setDescription(value)}
          style={{ backgroundColor: '#fff', width: '100%' }}
        />
        <h2 className="text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center">
          Application Link
        </h2>
        <input
          value={applicationLink}
          onChange={(e) => setApplicationLink(e.target.value)}
          name="applicationLink"
          type="text"
          placeholder="www.example.com"
          className="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink"
        />
        <div className="flex flex-row justify-between w-full text-left lg:flex-col">
          <div className="flex flex-col items-start text-left w-2/5 lg:w-full">
            <h2 className="text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center">
              Application Expiry Date
            </h2>
            <input
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              name="expiryDate"
              type="date"
              className="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink"
            />
          </div>
          <div className="flex flex-col items-start text-left w-2/5 lg:w-full">
            <h2 className="text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center">
              Is this position paid?
            </h2>
            <select
              id="paidPosition"
              value={isPaidPosition}
              onChange={(e) => setIsPaidPosition(e.target.value)}
              name="paidPosition"
              className="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink border-r-transparent border-r-8 bg-white"
            >
              <option value="" disabled selected>
                Please select an option
              </option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <div className="flex flex-row justify-between w-full text-left lg:flex-col">
          <div className="flex flex-col items-start text-left w-2/5 lg:w-full">
            <h2 className="text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center">
              Job Type
            </h2>
            <select
              id="jobType"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              name="jobType"
              className="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink border-r-transparent border-r-8 bg-white"
            >
              <option value="" disabled selected>
                Please select an option
              </option>
              <option value="intern">Intern</option>
              <option value="grad">Grad</option>
            </select>
          </div>
          <div className="flex flex-col items-start text-left w-2/5 lg:w-full">
            <h2 className="text-xl text-jb-headings mt-4 mb-2 font-bold self-start lg:self-center">
              Job Mode
            </h2>
            <select
              id="jobMode"
              value={jobMode}
              onChange={(e) => setJobMode(e.target.value)}
              name="jobMode"
              className="font-bold border-l-4 border-jb-textlink rounded-md p-4 mb-2 shadow-md w-full text-md focus:outline-jb-textlink border-r-transparent border-r-8 bg-white"
            >
              <option value="" disabled selected>
                Please select an option
              </option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>
        <h2 className="text-xl text-jb-headings mt-4 font-bold self-start lg:self-center">
          Applicant&apos;s Working Rights
        </h2>
        <p className="text-jb-subheadings mb-2 self-start lg:self-center">
          Please check all that applies
        </p>
        <div className="flex flex-row items-center self-start text-left text-lg">
          <input
            id="wr_aus_ctz"
            onChange={handleOnChangeWorkingRights}
            type="checkbox"
            value="aus_ctz"
            className="self-center mr-2 w-auto"
          />
          <label htmlFor="wr_aus_ctz">Australian Citizen</label>
        </div>
        <div className="flex flex-row items-center self-start text-left text-lg">
          <input
            id="wr_aus_perm_res"
            onChange={handleOnChangeWorkingRights}
            type="checkbox"
            value="aus_perm_res"
            className="self-center mr-2 w-auto"
          />
          <label htmlFor="wr_aus_perm_res">Australian Permanent Resident</label>
        </div>
        <div className="flex flex-row items-center self-start text-left text-lg">
          <input
            id="wr_aus_stud_visa"
            onChange={handleOnChangeWorkingRights}
            type="checkbox"
            value="aus_stud_visa"
            className="self-center mr-2 w-auto"
          />
          <label htmlFor="wr_aus_stud_visa">Australian Student Visa</label>
        </div>
        <div className="flex flex-row items-center self-start text-left text-lg">
          <input
            id="wr_aus_temp_grad_visa"
            onChange={handleOnChangeWorkingRights}
            type="checkbox"
            value="aus_temp_grad_visa"
            className="self-center mr-2 w-auto"
          />
          <label htmlFor="wr_aus_temp_grad_visa">Australian Temporary Grad Visa</label>
        </div>
        <div className="flex flex-row items-center self-start text-left text-lg">
          <input
            id="wr_nz_ctz_and_perm_res"
            onChange={handleOnChangeWorkingRights}
            type="checkbox"
            value="nz_ctz_and_perm_res"
            className="self-center mr-2 w-auto"
          />
          <label htmlFor="wr_nz_ctz_and_perm_res">NZ Citizen/Permanent Resident</label>
        </div>
        <div className="flex flex-row items-center self-start text-left text-lg">
          <input
            id="wr_no_wr"
            onChange={handleOnChangeWorkingRights}
            type="checkbox"
            value="no_wr"
            className="self-center mr-2 w-auto"
          />
          <label htmlFor="wr_no_wr">No Working Rights</label>
        </div>
        <div className="flex flex-row items-center self-start text-left text-lg">
          <input
            id="wr_all"
            onChange={handleOnChangeWorkingRights}
            type="checkbox"
            value="all"
            className="self-center mr-2 w-auto"
          />
          <label htmlFor="wr_all">All</label>
        </div>
        <div className="flex flex-row justify-between w-full text-left lg:flex-col">
          <div className="flex flex-col items-start text-left w-2/5 lg:w-full">
            <h2 className="text-xl text-jb-headings mt-4 font-bold self-start lg:self-center">
              Who Should Apply for this Role?
            </h2>
            <p className="text-jb-subheadings mb-2 self-start lg:self-center">
              Please check all that applies
            </p>
            <div>
              <div className="flex flex-row items-center self-start text-left text-lg">
                <input
                  id="student_demographic_final_year"
                  onChange={handleOnChangeStudentDemographic}
                  type="checkbox"
                  value="final_year"
                  className="self-center mr-2 w-auto"
                />
                <label htmlFor="student_demographic_final_year">Graduates</label>
              </div>
              <div className="flex flex-row items-center self-start text-left text-lg">
                <input
                  id="student_demographic_penultimate"
                  onChange={handleOnChangeStudentDemographic}
                  type="checkbox"
                  value="penultimate"
                  className="self-center mr-2 w-auto"
                />
                <label htmlFor="student_demographic_penultimate">Penultimate Students</label>
              </div>
              <div className="flex flex-row items-center self-start text-left text-lg">
                <input
                  id="student_demographic_all"
                  onChange={handleOnChangeStudentDemographic}
                  type="checkbox"
                  value="all"
                  className="self-center mr-2 w-auto"
                />
                <label htmlFor="student_demographic_all">All Students</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start text-left w-2/5 lg:w-full">
            <h2 className="text-xl text-jb-headings mt-4 font-bold self-start lg:self-center">
              Applicant&apos;s WAM
            </h2>
            <p className="text-jb-subheadings mb-2 self-start lg:self-center">
              Please select one option
            </p>
            <div>
              <div className="flex flex-row items-center self-start text-left text-lg">
                <input
                  id="applicantWam_HD"
                  onChange={handleOnChangeWamRequirements}
                  type="radio"
                  value="HD"
                  className="self-center mr-2 w-auto"
                />
                <label htmlFor="applicantWam_HD">High Distinction | 85 and above</label>
              </div>
              <div className="flex flex-row items-center self-start text-left text-lg">
                <input
                  id="applicantWam_D"
                  onChange={handleOnChangeWamRequirements}
                  type="radio"
                  value="D"
                  className="self-center mr-2 w-auto"
                />
                <label htmlFor="applicantWam_D">Distinction | 75 and above</label>
              </div>
              <div className="flex flex-row items-center self-start text-left text-lg">
                <input
                  id="applicantWam_C"
                  onChange={handleOnChangeWamRequirements}
                  type="radio"
                  value="C"
                  className="self-center mr-2 w-auto"
                />
                <label htmlFor="applicantWam_C">Credit | 65 and above</label>
              </div>
              <div className="flex flex-row items-center self-start text-left text-lg">
                <input
                  id="applicantWam_none"
                  onChange={handleOnChangeWamRequirements}
                  type="radio"
                  value="none"
                  className="self-center mr-2 w-auto"
                />
                <label htmlFor="applicantWam_none">No preference</label>
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-xl text-jb-headings my-4 font-bold self-start lg:self-center">
          Additional Information
        </h2>
        <ReactQuill
          value={additionalInfo}
          onChange={(value) => setAdditionalInfo(value)}
          style={{ backgroundColor: '#fff', width: '100%' }}
          modules={modules}
          placeholder={`Please note down any additional information that will make recommending jobs to students easier. This could be things like:
          - Point of contact for applicants to reach out with any questions.
          - What type of role is this? Eg: Frontend, Backend, Fullstack, Site Reliability Engineer, etc.
          - Is your company able to sponsor the applicant"s visa if needed?`}
        />
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col">
            <button
              className="border-none text-jb-textlink font-bold bg-jb-background mt-6 cursor-pointer hover:text-jb-textlink-hovered"
              onClick={() => setOpenModal(true)}
            >
              Preview
            </button>
            <button
              className="bg-jb-textlink rounded-md w-40 h-11 m-2 text-white font-bold text-base border-0
              shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
              onClick={submitJobPost}
            >
              Post Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostJobForm;
