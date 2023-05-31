import {
  JobMode, StudentDemographic, JobType, WorkingRights, WamRequirements,
} from './job-field';

export interface JobBase {
  id: number;
  role: string;
  applicationLink: string;
  description: string;
  company?: CompanyBase;
}

export interface JobInfo extends JobBase {
  expiry: number;
  jobMode: JobMode;
  studentDemographic: StudentDemographic[];
  jobType: JobType;
  workingRights: WorkingRights[];
  isPaid: boolean;
  additionalInfo: string;
  wamRequirements: WamRequirements;
}

export interface CompanyBase {
  name: string;
  description: string;
  location: string;
}

export interface CompanyAccountInfo {
  location: string;
  name: string;
  username: string;
  password: string;
  logo?: string;
}

export interface StudentZID {
  studentZID: string;
}

export interface StudentProfile {
  gradYear: number;
  wam: WamRequirements;
  workingRights: WorkingRights;
}

export interface JbToken {
  newJbToken: string;
}

export interface JobID {
  jobID: string;
}

export interface Offset {
  offset: string;
}

export interface CompanyID {
  companyID: string;
}

export interface CompanyAccountID {
  companyAccountID: string;
}

export interface AdminID {
  adminID: string;
}

export interface Logo {
  logo: string;
}

export interface AuthBody {
  username?: string;
  zID?: string;
  password: string;
}

export interface Year {
  year: string;
}
