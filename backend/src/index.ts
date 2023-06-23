import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import 'reflect-metadata';

import Auth from './auth';
import seedDB from './dev';
import { Logger, LogModule } from './logging';
import ev from './environment';
import Middleware from './middleware';
import { AppDataSource } from './config';
import AdminFunctions from './admin';
import CompanyFunctions from './company';
import StudentFunctions from './student';
import MailFunctions from './mail';
import openapi from './docs/openapi.json';

import {
  AdminApprovedJobPostsRequest,
  AdminCreateJobRequest,
  AdminJobRequest,
  AuthoriseStudentRequest,
  AuthRequest,
  CheckCompanyLogoRequest,
  CompanyGetJobsRequest,
  CompanyGetResetTokenRequest,
  CompanyInfoRequest,
  CompanyJobsRequest,
  CompanyResetPasswordEmailRequest,
  CompanyResetPasswordRequest,
  CompanyUploadLogoRequest,
  CreateCompanyRequest,
  CreateJobRequest,
  DeleteJobRequest,
  EditJobRequest,
  GeneralAdminRequest,
  GetHiddenJobsRequest,
  PasswordResetRequest,
  StudentFeaturedJobsRequest,
  StudentGetJobRequest,
  StudentPaginatedJobsRequest,
  UpdateCompanyDetailsRequest,
  VerifyCompanyAccountRequest,
  SearchJobRequest,
  StudentGetProfileRequest,
  StudentEditProfileRequest,
} from './types/request';

const LM = new LogModule('INDEX');

const app = express();
const port = ev.data().SERVER_PORT;
app.use(express.json({ limit: '5mb' }));
app.use(
  express.urlencoded({
    limit: '5mb',
    extended: true,
  }),
);
app.use(helmet());

let corsOptions;
if (ev.data().NODE_ENV !== 'development') {
  // assuming production, set up a particular config and allow only requests from
  // the current URL to be consumed
  const whitelist = ['https://jobsboard.csesoc.unsw.edu.au'];
  corsOptions = {
    origin: (origin: string, callback: (error: Error, status?: boolean) => void) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };
}

app.options('*', cors(corsOptions));

async function bootstrap() {
  await AppDataSource.initialize();
  await seedDB();
}

app.get(
  '/admin/jobs/pending',
  cors(corsOptions),
  Middleware.authoriseAdminMiddleware,
  (req: AdminJobRequest, res, next) => {
    (async () => {
      await AdminFunctions.GetPendingJobs(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/jobs/:offset',
  cors(corsOptions),
  (req: AuthoriseStudentRequest, res, next) => {
    (async () => {
      await Middleware.authoriseStudentMiddleware(req, res, next);
    })();
  },
  (req: StudentPaginatedJobsRequest, res, next) => {
    (async () => {
      await StudentFunctions.GetPaginatedJobs(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/job/:jobID',
  cors(corsOptions),
  (req: AuthoriseStudentRequest, res, next) => {
    (async () => {
      await Middleware.authoriseStudentMiddleware(req, res, next);
    })();
  },
  (req: StudentGetJobRequest, res, next) => {
    (async () => {
      await StudentFunctions.GetJob(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/student/job/:queryString',
  cors(corsOptions),
  (req: AuthoriseStudentRequest, res, next) => {
    (async () => {
      await Middleware.authoriseStudentMiddleware(req, res, next);
    })();
  },
  (req: SearchJobRequest, res, next) => {
    (async () => {
      await StudentFunctions.SearchJobs(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/job/company/hidden',
  cors(corsOptions),
  Middleware.authoriseCompanyMiddleware,
  (req: GetHiddenJobsRequest, res, next) => {
    (async () => {
      await CompanyFunctions.GetCompanyHiddenJobs(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/company/:companyID',
  cors(corsOptions),
  (req: AuthoriseStudentRequest, res, next) => {
    (async () => {
      await Middleware.authoriseStudentMiddleware(req, res, next);
    })();
  },
  (req: CompanyInfoRequest, res, next) => {
    (async () => {
      await CompanyFunctions.GetCompanyInfo(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/company/:companyID/jobs',
  cors(corsOptions),
  (req: AuthoriseStudentRequest, res, next) => {
    (async () => {
      await Middleware.authoriseStudentMiddleware(req, res, next);
    })();
  },
  (req: CompanyJobsRequest, res, next) => {
    (async () => {
      await CompanyFunctions.GetJobsFromCompany(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.post(
  '/authenticate/student',
  cors(corsOptions),
  (req: AuthRequest, res, next) => {
    (async () => {
      await Auth.AuthenticateStudent(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.put(
  '/company/update/details',
  cors(corsOptions),
  Middleware.authoriseCompanyMiddleware,
  (req: UpdateCompanyDetailsRequest, res, next) => {
    (async () => {
      await CompanyFunctions.UpdateCompanyDetails(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.post(
  '/authenticate/company',
  cors(corsOptions),
  (req: AuthRequest, res, next) => {
    (async () => {
      await Auth.AuthenticateCompany(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.put(
  '/company',
  cors(corsOptions),
  (req: CreateCompanyRequest, res, next) => {
    (async () => {
      await CompanyFunctions.CreateCompany(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.put(
  '/company/update/logo',
  cors(corsOptions),
  Middleware.authoriseCompanyMiddleware,
  (req: CompanyUploadLogoRequest, res, next) => {
    (async () => {
      await CompanyFunctions.UploadLogo(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.put(
  '/jobs',
  cors(corsOptions),
  Middleware.authoriseCompanyMiddleware,
  (req: CreateJobRequest, res, next) => {
    (async () => {
      await CompanyFunctions.CreateJob(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.put(
  '/company/job/edit',
  cors(corsOptions),
  Middleware.authoriseCompanyMiddleware,
  (req: EditJobRequest, res, next) => {
    (async () => {
      await CompanyFunctions.EditJob(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.post(
  '/company/forgot-password',
  cors(corsOptions),
  (req: CompanyResetPasswordEmailRequest, res, next) => {
    (async () => {
      await CompanyFunctions.SendResetPasswordEmail(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/company/password-reset-token/:username',
  cors(corsOptions),
  Middleware.privateRouteWrapper,
  (req: CompanyGetResetTokenRequest, res, next) => {
    (async () => {
      await CompanyFunctions.GetPasswordResetToken(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.put(
  '/company/password-reset',
  cors(corsOptions),
  (req: PasswordResetRequest, res, next) => {
    (async () => {
      await Middleware.authenticateResetPasswordRequestMiddleware(req, res, next);
    })();
  },
  (req: CompanyResetPasswordRequest, res, next) => {
    (async () => {
      await CompanyFunctions.PasswordReset(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.post(
  '/authenticate/admin',
  cors(corsOptions),
  (req: AuthRequest, res, next) => {
    (async () => {
      await Auth.AuthenticateAdmin(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.patch(
  '/job/:jobID/approve',
  cors(corsOptions),
  Middleware.authoriseAdminMiddleware,
  (req: AdminJobRequest, res, next) => {
    (async () => {
      await AdminFunctions.ApproveJobRequest(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.patch(
  '/job/:jobID/reject',
  cors(corsOptions),
  Middleware.authoriseAdminMiddleware,
  (req: AdminJobRequest, res, next) => {
    (async () => {
      await AdminFunctions.RejectJobRequest(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/admin/pending/companies',
  cors(corsOptions),
  Middleware.authoriseAdminMiddleware,
  (req: GeneralAdminRequest, res, next) => {
    (async () => {
      await AdminFunctions.GetPendingCompanyVerifications(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.patch(
  '/admin/company/:companyAccountID/verify',
  cors(corsOptions),
  Middleware.authoriseAdminMiddleware,
  (req: VerifyCompanyAccountRequest, res, next) => {
    (async () => {
      await AdminFunctions.VerifyCompanyAccount(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/job/admin/hidden',
  cors(corsOptions),
  Middleware.authoriseAdminMiddleware,
  (req: GeneralAdminRequest, res, next) => {
    (async () => {
      await AdminFunctions.GetAllHiddenJobs(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/companyjobs',
  cors(corsOptions),
  Middleware.authoriseCompanyMiddleware,
  (req: CompanyGetJobsRequest, res, next) => {
    (async () => {
      await CompanyFunctions.GetAllJobsFromCompany(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/company/logo/status',
  cors(corsOptions),
  Middleware.authoriseCompanyMiddleware,
  (req: CheckCompanyLogoRequest, res, next) => {
    (async () => {
      await CompanyFunctions.GetCompanyLogoStatus(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.delete(
  '/company/job/:jobID',
  cors(corsOptions),
  Middleware.authoriseCompanyMiddleware,
  (req: DeleteJobRequest, res, next) => {
    (async () => {
      await CompanyFunctions.MarkJobPostRequestAsDeleted(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/company/stats/verifiedCompanies',
  cors(corsOptions),
  Middleware.authoriseAdminMiddleware,
  (req: GeneralAdminRequest, res, next) => {
    (async () => {
      await AdminFunctions.GetNumVerifiedCompanies(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/job/stats/approvedJobPosts/:year',
  cors(corsOptions),
  Middleware.authoriseAdminMiddleware,
  (req: AdminApprovedJobPostsRequest, res, next) => {
    (async () => {
      await AdminFunctions.getNumApprovedJobPosts(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/admin/companies',
  cors(corsOptions),
  Middleware.authoriseAdminMiddleware,
  (req: GeneralAdminRequest, res, next) => {
    (async () => {
      await AdminFunctions.ListAllCompaniesAsAdmin(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.put(
  '/admin/company/:companyID/jobs',
  cors(corsOptions),
  Middleware.authoriseAdminMiddleware,
  (req: AdminCreateJobRequest, res, next) => {
    (async () => {
      await AdminFunctions.CreateJobOnBehalfOfExistingCompany(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/featured-jobs',
  cors(corsOptions),
  (req: StudentFeaturedJobsRequest, res, next) => {
    (async () => {
      await StudentFunctions.GetFeaturedJobs(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.get(
  '/student/profile',
  cors(corsOptions),
  (req: AuthoriseStudentRequest, res, next) => {
    (async () => {
      await Middleware.authoriseStudentMiddleware(req, res, next);
    })();
  },
  (req: StudentGetProfileRequest, res, next) => {
    (async () => {
      await StudentFunctions.GetStudentProfile(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

app.put(
  '/student/profile/edit',
  cors(corsOptions),
  (req: AuthoriseStudentRequest, res, next) => {
    (async () => {
      await Middleware.authoriseStudentMiddleware(req, res, next);
    })();
  },
  (req: StudentEditProfileRequest, res, next) => {
    (async () => {
      await StudentFunctions.EditStudentProfile(req, res, next);
    })();
  },
  Middleware.genericLoggingMiddleware,
);

if (ev.data().NODE_ENV === 'development') {
  app.post('/email', (req, res) => {
    (async () => {
      await MailFunctions.SendTestEmail(req, res);
    })();
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
}

app.listen(port, () => {
  (async () => {
    if (ev.data().NODE_ENV === 'development') {
      await bootstrap();
    } else {
      await AppDataSource.initialize();
    }
    if (ev.data().NODE_ENV === 'production') {
      MailFunctions.InitMailQueueScheduler(2000);
    }
    Logger.Info(LM, `SERVER STARTED AT PORT=${port}`);
  })();
});
