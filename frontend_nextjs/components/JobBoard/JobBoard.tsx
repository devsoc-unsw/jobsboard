import React from 'react';
import { Job } from 'types/api';
import JobPostCard from 'components/JobPostCard/JobPostCard';
import JobProfileCard from 'components/JobProfileCard/JobProfileCard';

export type BoardStatus = 'postedJobs' | 'expiredJobs';

type JobBoardProps = {
  jobList: Job[];
  status: BoardStatus;
};

const JobBoard = ({ jobList, status }: JobBoardProps) => {
  return (
    <div className="w-[700px] border-4 border-[#75B2F5] h-[600px] m-auto rounded-xl place-items-center mt-4 md:w-64">
      <div className="bg-white h-full grid grid-cols-3 rounded-xl overflow-y-scroll md:grid-cols-1">
        {status === 'postedJobs' && <JobPostCard />}
        {jobList.map((job) => (
          <JobProfileCard
            key={job.id}
            id={job.id}
            role={job.role}
            isPaid={job.isPaid}
            jobType={job.jobType}
            mode={job.mode}
            expiry={job.expiry}
            studentDemographic={job.studentDemographic}
            description={job.description}
            applicationLink={job.applicationLink}
            workingRights={job.workingRights}
            wamRequirements={job.wamRequirements}
            additionalInfo={job.additionalInfo}
            status={status}
          />
        ))}
      </div>
    </div>
  );
};

export default JobBoard;
