import React from 'react';
import JobPostCard from 'components/JobPostCard/JobPostCard';
import JobProfileCard from 'components/JobProfileCard/JobProfileCard';

type JobBoardProps = {
  jobList: any[];
  listName: string;
};

const JobBoard = ({ jobList, listName }: JobBoardProps) => {
  return (
    <div className="w-[700px] border-4 border-[#75B2F5] h-[600px] m-auto rounded-xl place-items-center mt-4 md:w-64">
      <div className="bg-white h-full grid grid-cols-3 rounded-xl overflow-y-scroll md:grid-cols-1">
        {listName === 'postedJobs' && <JobPostCard />}
        {jobList.map((job) => (
          <JobProfileCard
            key={job.key}
            jobID={job.id}
            role={job.role}
            isPaidPosition={job.isPaidPosition}
            jobType={job.jobType}
            mode={job.mode}
            expiry={job.expiry}
            studentDemographic={job.studentDemographic}
            description={job.description}
            applicationLink={job.applicationLink}
            workingRights={job.workingRights}
            wamRequirements={job.wamRequirements}
            additionalInfo={job.additionalInfo}
            listName={listName}
          />
        ))}
      </div>
    </div>
  );
};

export default JobBoard;
