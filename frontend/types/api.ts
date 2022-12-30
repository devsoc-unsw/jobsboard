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

// /companyJobs
export type CompanyJob = {
  id: number;
  role: string;
  description: string;
  applicationLink: string;
  status: string;
  additionalInfo: string;
  expiry: string;
  mode: string;
  studentDemographic: StudentDemographic[];
  jobType: string;
  workingRights: WorkingRights[];
  wamRequirements: WamRequirements;
  isPaid: boolean;
};

export type CompanyJobsPayload = {
  companyJobs: CompanyJob[];
};

// /job/company/hidden
export type HiddenJob = {
  id: number;
  role: string;
  mode: string;
  studentDemographic: StudentDemographic[];
  jobType: string;
  workingRights: WorkingRights[];
  wamRequirements: WamRequirements;
  additionalInfo: string;
  description: string;
  applicationLink: string;
  isPaid: boolean;
  approved: boolean;
  hidden: boolean;
  deleted: boolean;
  expiry: string;
};

export type HiddenJobsPayload = {
  hiddenJobs: HiddenJob[];
};
