// modules
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';

import 'reflect-metadata';

import { DataSource } from 'typeorm';

// custom libraries
import Auth from './auth';
import { seedDB } from './dev';
import Logger from './logging';

// endpoint implementations
import AdminFunctions from './admin';
import CompanyFunctions from './company';
import StudentFunctions from './student';
import MailFunctions from './mail';

// custom entities
import { AdminAccount } from './entity/admin_account';
import { Company } from './entity/company';
import { CompanyAccount } from './entity/company_account';
import { Job } from './entity/job';
import { Student } from './entity/student';
import { MailRequest } from './entity/mail_request';
import { Logs } from './entity/logs';
import { Statistics } from './entity/statistics';

// custom middleware
import Middleware from './middleware';

// openapi documentation
import openapi from './docs/openapi.json';

// dotenv.config({ path: '../.env' });
dotenv.config();
Logger.Init();

const app = express();
const port = process.env.SERVER_PORT;
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb' }));
app.use(helmet());

let corsOptions;
if (process.env.NODE_ENV !== 'development') {
  // assuming production, set up a particular config and allow only requests from
  // the current URL to be consumed
  const whitelist = ['https://jobsboard.csesoc.unsw.edu.au'];
  const corsOptions = {
    origin: (origin: any, callback: Function) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };
}

app.options('*', cors(corsOptions));

const activeEntities = [Company, CompanyAccount, Job, Student, AdminAccount, MailRequest, Logs, Statistics];

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: activeEntities,
  migrations: [],
  subscribers: [],
});

async function bootstrap() {
  await AppDataSource.initialize();
  await seedDB(activeEntities);
}

app.get(
  '/admin/jobs/pending',
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.GetPendingJobs,
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/jobs/:offset',
  cors(corsOptions),
  Middleware.authenticateStudentMiddleware,
  StudentFunctions.GetPaginatedJobs,
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/job/:jobID',
  cors(corsOptions),
  Middleware.authenticateStudentMiddleware,
  StudentFunctions.GetJob,
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/student/job/:queryString',
  cors(corsOptions),
  Middleware.authenticateStudentMiddleware,
  StudentFunctions.SearchJobs,
  Middleware.genericLoggingMiddleware
)

app.get(
  '/job/company/hidden',
  cors(corsOptions),
  Middleware.authenticateCompanyMiddleware,
  CompanyFunctions.GetCompanyHiddenJobs,
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/company/:companyID',
  cors(corsOptions),
  Middleware.authenticateStudentMiddleware,
  CompanyFunctions.GetCompanyInfo,
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/company/:companyID/jobs',
  cors(corsOptions),
  Middleware.authenticateStudentMiddleware,
  CompanyFunctions.GetJobsFromCompany,
  Middleware.genericLoggingMiddleware,
);

app.post('/authenticate/student', cors(corsOptions), Auth.AuthenticateStudent, Middleware.genericLoggingMiddleware);

app.put(
  '/company/update/details',
  cors(corsOptions),
  Middleware.authenticateCompanyMiddleware,
  CompanyFunctions.UpdateCompanyDetails,
  Middleware.genericLoggingMiddleware,
);

app.post('/authenticate/company', cors(corsOptions), Auth.AuthenticateCompany, Middleware.genericLoggingMiddleware);

app.put('/company', cors(corsOptions), CompanyFunctions.CreateCompany, Middleware.genericLoggingMiddleware);

app.put(
  '/company/update/logo',
  cors(corsOptions),
  Middleware.authenticateCompanyMiddleware,
  CompanyFunctions.UploadLogo,
  Middleware.genericLoggingMiddleware,
);

app.put(
  '/jobs',
  cors(corsOptions),
  Middleware.authenticateCompanyMiddleware,
  CompanyFunctions.CreateJob,
  Middleware.genericLoggingMiddleware,
);

app.put(
  '/company/job/edit',
  cors(corsOptions),
  Middleware.authenticateCompanyMiddleware,
  CompanyFunctions.EditJob,
  Middleware.genericLoggingMiddleware,
);

app.post(
  '/company/forgot-password',
  cors(corsOptions),
  CompanyFunctions.SendResetPasswordEmail,
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/company/password-reset-token/:username',
  cors(corsOptions),
  Middleware.privateRouteWrapper,
  CompanyFunctions.GetPasswordResetToken,
  Middleware.genericLoggingMiddleware,
);

app.put(
  '/company/password-reset',
  cors(corsOptions),
  Middleware.authenticateResetPasswordRequestMiddleware,
  CompanyFunctions.PasswordReset,
  Middleware.genericLoggingMiddleware,
);

app.post('/authenticate/admin', cors(corsOptions), Auth.AuthenticateAdmin, Middleware.genericLoggingMiddleware);

app.patch(
  '/job/:jobID/approve',
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.ApproveJobRequest,
  Middleware.genericLoggingMiddleware,
);

app.patch(
  '/job/:jobID/reject',
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.RejectJobRequest,
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/admin/pending/companies',
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.GetPendingCompanyVerifications,
  Middleware.genericLoggingMiddleware,
);

app.patch(
  '/admin/company/:companyAccountID/verify',
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.VerifyCompanyAccount,
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/job/admin/hidden',
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.GetAllHiddenJobs,
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/companyjobs',
  cors(corsOptions),
  Middleware.authenticateCompanyMiddleware,
  CompanyFunctions.GetAllJobsFromCompany,
  Middleware.genericLoggingMiddleware,
);

app.get(
  "/company/logo/status",
  cors(corsOptions),
  Middleware.authenticateCompanyMiddleware,
  CompanyFunctions.GetCompanyLogoStatus,
  Middleware.genericLoggingMiddleware
);

app.delete(
  '/company/job/:jobID',
  cors(corsOptions),
  Middleware.authenticateCompanyMiddleware,
  CompanyFunctions.MarkJobPostRequestAsDeleted,
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/company/stats/verifiedCompanies',
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.GetNumVerifiedCompanies,
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/job/stats/approvedJobPosts/:year',
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.getNumApprovedJobPosts,
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/admin/companies',
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.ListAllCompaniesAsAdmin,
  Middleware.genericLoggingMiddleware,
);

app.put(
  '/admin/company/:companyID/jobs',
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.CreateJobOnBehalfOfExistingCompany,
  Middleware.genericLoggingMiddleware,
);

app.get('/featured-jobs', cors(corsOptions), StudentFunctions.GetFeaturedJobs, Middleware.genericLoggingMiddleware);

if (process.env.NODE_ENV === 'development') {
  app.post('/email', MailFunctions.SendTestEmail);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
}

app.listen(port, async () => {
  if (process.env.NODE_ENV === 'development') {
    await bootstrap();
  } else {
    await AppDataSource.initialize();
  }
  if (process.env.NODE_ENV === 'production') {
    await MailFunctions.InitMailQueueScheduler(2000);
  }
  Logger.Info(`SERVER STARTED AT PORT=${port}`);
});
