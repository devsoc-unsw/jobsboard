// global types
export enum JobMode {
  Onsite = 'onsite',
  Hybrid = 'hybrid',
  Remote = 'remote'
}

export enum StudentDemographic {
  Penultimate = 'penultimate',
  FinalYear = 'final_year',
  All = 'all'
}

export enum JobType {
  Intern = 'intern',
  Grad = 'grad'
}

export enum WorkingRights {
  AusCtz = 'aus_ctz',
  AusPermRes = 'aus_perm_res',
  AusStudVisa = 'aus_stud_visa',
  AusTempGradVisa = 'aus_temp_grad_visa',
  NzCtzPermRes = 'nz_ctz_and_perm_res',
  NoWr = 'no_wr',
  All = 'all'
}

export enum WamRequirements {
  HD = 'HD',
  D = 'D',
  C = 'C',
  None = 'none'
}

// root tyoes
export type FeaturedJob = {
  id: number;
  logo: string;
  role: string;
  description: string;
  workingRights: WorkingRights[];
  applicationLink: string;
  company: string;
};

export type FeaturedJobsPayload = {
  featuredJobs: FeaturedJob[];
};

// authentication types
export type AuthenticationPayload = {
  token: string;
};

// student types
export type Job = {
  id: number;
  role: string;
  mode: JobMode;
  studentDemographic: StudentDemographic[];
  jobType: JobType;
  workingRights: WorkingRights[];
  wamRequirements: WamRequirements;
  additionalInfo: string;
  description: string;
  applicationLink: string;
  isPaid: boolean;
  expiry: string;
};

export type JobWithCompany = Job & {
  company: Company;
};

export type JobPayload = {
  job: JobWithCompany;
};

export type JobsPayload = {
  jobs: JobWithCompany[];
};

// company types
export type Company = {
  id: number;
  name: string;
  location: string;
  description: string;
  logo: Buffer;
  sponsor: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CompanyJobsPayload = {
  companyJobs: Job[];
};

export type HiddenJob = Job & {
  approved: boolean;
  deleted: boolean;
  hidden: boolean;
};

export type CompanyHiddenJobsPayload = {
  hiddenJobs: HiddenJob[];
};

// admin types
export type AdminPendingCompany = {
  company: Company;
  id: number;
};

export type AdminCompany = {
  id: number;
  location: string;
  name: string;
};

export type AdminPendingCompaniesPayload = {
  pendingCompanyVerifications: AdminPendingCompany[];
  token: string;
};

export type AdminPendingJobsPayload = {
  pendingJobs: JobWithCompany[];
  token: string;
};

export type AdminCompaniesPayload = {
  companies: AdminCompany[];
};
