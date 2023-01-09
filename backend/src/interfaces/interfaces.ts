import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import {
  JobMode,
  StudentDemographic,
  JobType,
  WorkingRights,
  WamRequirements,
} from '../types/job-field';

// * General

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

interface CompanyAccountInfo {
  location: string;
  name: string;
  username: string;
  password: string;
  logo?: string;
}

interface StudentZID {
  studentZID: string;
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

interface AdminID {
  adminID: string;
}

interface Logo {
  logo: string;
}

interface AuthBody {
  username?: string;
  zID?: string;
  password: string;
}

interface Year {
  year: string;
}

interface JobIDParams extends ParamsDictionary, JobID {}
interface CompanyIdParams extends ParamsDictionary, CompanyID {}
interface CompanyAccountIdParams extends ParamsDictionary, CompanyAccountID {}
interface PaginatedJobsParams extends ParamsDictionary, Offset {}
interface YearParams extends ParamsDictionary, Year {}

// * Middleware
export interface AuthoriseStudentRequest extends Request, StudentZID {}
export interface AuthoriseCompanyRequest extends Request, CompanyAccountID {}
export interface AuthoriseAdminRequest extends Request, JbToken, AdminID {}
export interface PasswordResetRequest extends Request, CompanyAccountID {}

// * Auth Functions
export type AuthRequest = Request<Record<string, never>, never, AuthBody>;

// * Admin Functions
type AdminRequestBase = AdminID & JbToken;

export interface GeneralAdminRequest extends Request, AdminRequestBase {}

export interface AdminJobRequest extends Request<JobIDParams>, AdminRequestBase {}

export interface VerifyCompanyAccountRequest
  extends Request<CompanyAccountIdParams>, AdminRequestBase {}

export interface AdminCreateJobRequest
  extends Request<JobIDParams, never, JobInfo>, AdminRequestBase {}

export interface AdminApprovedJobPostsRequest extends Request<YearParams>, AdminRequestBase {}

// * StudentFunctions

export interface StudentPaginatedJobsRequest
  extends Request<PaginatedJobsParams>,
  StudentZID,
  JbToken {}

export interface StudentGetJobRequest extends Request<JobIDParams>, StudentZID, JbToken {}

export interface StudentFeaturedJobsRequest extends Request, JbToken {}

interface QueryString {
  queryString: string;
}
interface QueryStringParams extends ParamsDictionary, QueryString {}
export interface SearchJobRequest extends Request<QueryStringParams>, StudentZID, JbToken {}

// * CompanyFunctions

interface CompanyResetPasswordEmailBody {
  username: string;
}

interface CompanyResetPasswordBody {
  newPassword: string;
}

interface CompanyResetEmailParams extends ParamsDictionary, CompanyResetPasswordEmailBody {}

export interface CompanyInfoRequest extends Request<CompanyIdParams>, StudentZID, JbToken {}

export type CompanyJobsRequest = CompanyInfoRequest;

export type CreateCompanyRequest = Request<Record<string, never>, never, CompanyAccountInfo>;

export interface CreateJobRequest
  extends Request<Record<string, never>, never, JobInfo>,
  CompanyAccountID,
  JbToken {}

export interface GetHiddenJobsRequest extends Request, CompanyAccountID, CompanyID, JbToken {}

export type EditJobRequest = CreateJobRequest;

export interface CompanyGetJobsRequest extends Request, CompanyAccountID, JbToken {}

export interface DeleteJobRequest extends Request<JobIDParams>, CompanyAccountID, JbToken {}

export interface CompanyResetPasswordEmailRequest
  extends Request<Record<string, never>, never, CompanyResetPasswordEmailBody>,
  JbToken {}

export type CompanyGetResetTokenRequest = Request<CompanyResetEmailParams>;

export type CompanyResetPasswordRequest =
  Request<Record<string, never>, never, CompanyResetPasswordBody>;

export interface CompanyUploadLogoRequest
  extends Request<Record<string, never>, never, Logo>, CompanyAccountID {}

export interface CheckCompanyLogoRequest extends Request, CompanyAccountID {}

interface UpdateCompanyBody extends CompanyBase, Logo {}
export interface UpdateCompanyDetailsRequest extends
  Request<Record<string, never>, never, UpdateCompanyBody>, CompanyAccountID {}
