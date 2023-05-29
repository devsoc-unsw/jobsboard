'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import AppContext from 'contexts/AppContext';
import { useRouter } from 'next/navigation';
import PendingJobCard from 'components/PendingJobCard/PendingJobCard';
import JobUnapproveCard from 'components/JobUnapproveCard/JobUnapproveCard';
import Toast from 'components/Toast/Toast';
import api from 'config/api';
import { AdminPendingJobsPayload, JobWithCompany, AdminApprovedJobsPayload } from 'types/api';
import Tabs from 'components/Tabs/Tabs';
import Spinner from 'ui/Spinner/Spinner';

const AdminJobsPage = () => {
  const router = useRouter();
  const { apiToken, setApiToken } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [successMsgUnapprove, setSuccessMsgUnapprove] = useState('');
  const [errorMsgUnapprove, setErrorMsgUnapprove] = useState('');

  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [curJob, setCurJob] = useState<JobWithCompany | null>(null);
  const [approvedJobs, setApprovedJobs] = useState<JobWithCompany[]>([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get<AdminPendingJobsPayload>('/admin/jobs/pending', {
          headers: {
            Authorization: apiToken
          }
        });

        setJobs(res.data.pendingJobs);
      } catch (e) {
        window.scrollTo(0, 10);
        setErrorMsg('Failed to get pending jobs.');
        if (e instanceof AxiosError) {
          if (e.response?.status === 401) {
            setErrorMsg('You are not authorized to perform this action. Redirecting to home page.');
            setTimeout(() => {
              router.push('/');
            }, 3000);
          }
        }
      }
    };

    const fetchApprovedJobs = async () => {
      try {
        const res = await api.get<AdminApprovedJobsPayload>('/job/admin/approved', {
          headers: {
            Authorization: apiToken
          }
        });

        setApprovedJobs(res.data.approvedJobs);
        
      } catch (e) {
          window.scrollTo(0, 10);
          setErrorMsg('Failed to get approved jobs.');
          if (e instanceof AxiosError) {
            if (e.response?.status === 401) {
              setErrorMsg('You are not authorized to perform this action. Redirecting to home page.');
              setTimeout(() => {
                router.push('/');
              }, 3000);
            }
          }
      }
    }
    
    fetchApprovedJobs();
    setLoading(false);
    fetchJobs();
  

  }, []);

  const onSuccess = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(''), 3000);
  };
  const onError = (message: string) => {
    setErrorMsg(message);
    setTimeout(() => setErrorMsg(''), 3000);
  };

  const onSuccessUnapprove = (message: string) => {
    setSuccessMsgUnapprove(message);
    setTimeout(() => setSuccessMsgUnapprove(''), 3000);
  }

  const onErrorUnapprove = (message: string) => {
    setErrorMsgUnapprove(message);
    setTimeout(() => setErrorMsgUnapprove(''), 3000);
  }

  const handleShowModal = (pendingJob: JobWithCompany) => {
    setCurJob(pendingJob);
    setOpenModal(true);
  }

  return (
    <div className="">
      {successMsg + errorMsg !== '' && (
        <Toast message={successMsg || errorMsg} type={successMsg ? 'success' : 'error'} />
      )}

      {loading && <Spinner />}


      <Tabs>
        <div className="flex flex-col px-8 items-center" title="Pending Job Requests">
          <h1 className="text-jb-headings font-bold text-3xl mt-10 mb-4">
            Pending Job Requests
          </h1>
          <h3 className="text-jb-subheadings mb-12">
            {jobs.length} Pending {jobs.length === 1 ? 'Job' : 'Jobs'}
          </h3>
          
        {jobs.map((job) => (
        <PendingJobCard
          key={job.id}
          company={job.company.name}
          location={job.company.location}
          id={job.id}
          role={job.role}
          description={job.description}
          applicationLink={job.applicationLink}
          expiry={job.expiry}
          isPaid={job.isPaid}
          jobType={job.jobType}
          mode={job.mode}
          workingRights={job.workingRights}
          studentDemographic={job.studentDemographic}
          wamRequirements={job.wamRequirements}
          additionalInfo={job.additionalInfo}
          onSuccess={onSuccess}
          onError={onError}
          onRemove={() => setJobs((prevState) => prevState.filter((j) => j.id !== job.id))}
        />
      ))}
        </div>

        <div className="flex flex-col px-8 items-center" title="Unapprove Existing Jobs">
          <h1 className="text-jb-headings font-bold text-3xl mt-10 mb-4">
              Unapprove Existing Jobs
          </h1>
          <h3 className="text-jb-subheadings mb-12">
              {approvedJobs.length} Pending {approvedJobs.length === 1 ? 'Job' : 'Jobs'}
          </h3>

          {jobs.map((job) => (
            <JobUnapproveCard
              key={job.id}
              company={job.company.name}
              location={job.company.location}
              id={job.id}
              role={job.role}
              description={job.description}
              applicationLink={job.applicationLink}
              expiry={job.expiry}
              isPaid={job.isPaid}
              jobType={job.jobType}
              mode={job.mode}
              workingRights={job.workingRights}
              studentDemographic={job.studentDemographic}
              wamRequirements={job.wamRequirements}
              additionalInfo={job.additionalInfo}
              onSuccess={onSuccessUnapprove}
              onError={onErrorUnapprove}
              onRemove={() => setJobs((prevState) => prevState.filter((j) => j.id !== job.id))}
              onClick={() => handleShowModal(job)}
            />
          ))}


        </div>
      </Tabs>
    </div>
  );
};

export default AdminJobsPage;
