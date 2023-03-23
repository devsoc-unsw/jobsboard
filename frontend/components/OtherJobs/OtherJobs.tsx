import React from 'react';
import { Job, JobWithCompany } from 'types/api';
import JobListingMinimal from 'components/JobListingMinimal/JobListingMinimal';

type JobCardProps = {
  job: JobWithCompany,
  companyJobs: Job[]
  className?: string | undefined;
};

const JobCard = ({
  job,
  companyJobs,
  className
}: JobCardProps) => {
  const outsideClass = className ? className : ""
  return (
    <div className={outsideClass + " flex flex-col py-4 px-2 h-full max-h-96 bg-white rounded-lg overflow-y-auto shadow-card"}>
      <h2
        className={`font-bold text-lg text-center text-jb-headings ${
          companyJobs.length === 0 ? 'my-auto' : 'mb-4'
        }`}
      >
        {companyJobs.length === 0
          ? 'There are no other jobs from this company.'
          : 'Other jobs from this company'}
      </h2>
      <div className="flex flex-col md:flex-row justify-between overflow-auto">
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
  );
};

export default JobCard;