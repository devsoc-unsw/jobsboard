
import { JobMode, JobType, StudentDemographic, WamRequirements, WorkingRights } from "../../../src/types/job-field";
import Company from "../../../src/entity/company";
import Job from "../../../src/entity/job";

export const createJob = (
  role: string,
  description: string,
  applicationLink: string,
  approved: boolean,
  company: Company,
  mode: JobMode,
  studentDemographic: StudentDemographic[],
  jobType: JobType,
  workingRights: WorkingRights[],
  wam: WamRequirements,
  expiry: Date,
  additionalInfo?: string,
  paid?: boolean,
  hidden?: boolean
) => {
  const job = new Job();
  job.role = role;
  job.description = description;
  job.applicationLink = applicationLink,
  job.approved = approved;
  job.hidden = hidden !== undefined ? hidden : false;
  job.company = company;
  job.mode = mode;
  job.studentDemographic = studentDemographic;
  job.jobType = jobType;
  job.workingRights = workingRights
  job.wamRequirements = wam;
  job.additionalInfo = additionalInfo !== undefined ? additionalInfo : ' ';
  job.isPaid = paid !== undefined ? paid : true;
  job.expiry = expiry;
  return job;
}