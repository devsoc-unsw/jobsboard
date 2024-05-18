import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import {
  AdminID,
  AuthBody,
  CompanyAccountID,
  CompanyAccountInfo,
  CompanyBase,
  CompanyID,
  JbToken,
  JobID,
  JobInfo,
  Logo,
  Offset,
  StudentZID,
  StudentProfileInfo,
  Year,
  UnofficialCompanyAccountInfo,
} from './shared';

export interface JobIDParams extends ParamsDictionary, JobID {}
export interface CompanyIdParams extends ParamsDictionary, CompanyID {}
export interface CompanyAccountIdParams extends ParamsDictionary, CompanyAccountID {}
export interface PaginatedJobsParams extends ParamsDictionary, Offset {}
export interface YearParams extends ParamsDictionary, Year {}

// * Middleware
export interface AuthoriseStudentRequest extends Request, StudentZID {}
export interface AuthoriseCompanyRequest extends Request, CompanyAccountID {}
export interface AuthoriseAdminRequest extends Request, JbToken, AdminID {}
export interface PasswordResetRequest extends Request, CompanyAccountID {}

// * Auth
export type AuthRequest = Request<Record<string, never>, never, AuthBody>;

// * Admin
type AdminRequestBase = AdminID & JbToken;

export interface GeneralAdminRequest extends Request, AdminRequestBase {}

export interface AdminJobRequest extends Request<JobIDParams>, AdminRequestBase {}

export interface VerifyCompanyAccountRequest
  extends Request<CompanyAccountIdParams>,
    AdminRequestBase {}

export interface UnverifyCompanyAccountRequest
  extends Request<CompanyAccountIdParams>,
    AdminRequestBase {}

export interface AdminCreateJobRequest
  extends Request<JobIDParams, never, JobInfo>,
    AdminRequestBase {}

export interface AdminApprovedJobPostsRequest extends Request<YearParams>, AdminRequestBase {}

// * Student
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

export interface StudentGetProfileRequest extends Request, StudentZID, JbToken {}
export interface StudentEditProfileRequest
  extends Request<Record<string, never>, never, StudentProfileInfo>,
    StudentZID,
    JbToken {}

// * Company
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

export type CreateUnofficialCompanyRequest = Request<
  Record<string, never>,
  never,
  UnofficialCompanyAccountInfo
>;

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

export type CompanyResetPasswordRequest = Request<
  Record<string, never>,
  never,
  CompanyResetPasswordBody
>;

export interface CompanyUploadLogoRequest
  extends Request<Record<string, never>, never, Logo>,
    CompanyAccountID {}

export interface CheckCompanyLogoRequest extends Request, CompanyAccountID, JbToken {}

interface UpdateCompanyBody extends CompanyBase, Logo {}
export interface UpdateCompanyDetailsRequest
  extends Request<Record<string, never>, never, UpdateCompanyBody>,
    CompanyAccountID {}
