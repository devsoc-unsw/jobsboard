import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import {
  JobMode,
  StudentDemographic,
  JobType,
  WorkingRights,
  WamRequirements,
} from '../types/job-field';

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

// 1) interface should extend from below if they have properties that can be
// accessed like req.property
interface StudentZID {
  studentZID: number;
}

interface JbToken {
  newJbToken: string;
}

interface JobID {
  jobID: string;
}

interface Offset {
  offset: string;
}

interface CompanyID {
  companyID: string;
}

interface CompanyAccountID {
  companyAccountID: string;
}

// * Middleware
export interface AuthoriseStudentRequest extends Request, StudentZID {}

// * StudentFunctions

// GetPaginatedJobs
interface PaginatedJobsParams extends ParamsDictionary, Offset {}

export interface StudentPaginatedJobsRequest
  extends Request<PaginatedJobsParams>,
  StudentZID,
  JbToken {}

// GetJob
interface GetJobParams extends ParamsDictionary, JobID {}

export interface StudentGetJobReQuest extends Request<GetJobParams>, StudentZID, JbToken {}

// GetFeaturedJobs
export interface StudentFeaturedJobsRequest extends Request, JbToken {}

// * CompanyFunctions

// GetCompanyInfo
interface CompanyInfoParams extends ParamsDictionary, CompanyID {}

export interface CompanyInfoRequest extends Request<CompanyInfoParams>, StudentZID, JbToken {}

// GetJobsFromCompany
export type CompanyJobsRequest = CompanyInfoRequest;

// CreateCompany
interface CreateCompanyBody {
  location: string;
  name: string;
  username: string;
  password: string;
}

export type CreateCompanyRequest =
  // request has no parms and resBody
  Request<Record<string, never>, never, CreateCompanyBody>;

// CreateJob
export interface CreateJobRequest
  extends Request<Record<string, never>, never, JobInfo>,
  CompanyAccountID,
  JbToken {}

// GetCompanyHiddenJobs
export interface GetCompanyHiddenJobs
  extends Request, CompanyAccountID, CompanyID, JbToken {}
