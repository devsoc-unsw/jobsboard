// modules
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";
import helmet from "helmet";

import "reflect-metadata";
import {
  ConnectionOptions,
  createConnection,
} from "typeorm";

// custom libraries
import Auth from "./auth";
import { seedDB } from "./dev";
import Logger from "./logging";

// endpoint implementations
import AdminFunctions from "./admin";
import CompanyFunctions from "./company";
import StudentFunctions from "./student";
import MailFunctions from "./mail";

// custom entities
import { AdminAccount } from "./entity/admin_account";
import { Company } from "./entity/company";
import { CompanyAccount } from "./entity/company_account";
import { Job } from "./entity/job";
import { Student } from "./entity/student";
import { MailRequest } from "./entity/mail_request";
import { Logs } from "./entity/logs";

// custom middleware
import Middleware from "./middleware";

// dotenv.config({ path: '../.env' });
dotenv.config();
Logger.Init();

const app = express();
const port = process.env.SERVER_PORT;
app.use(bodyParser.json());
app.use(helmet());

var corsOptions;
if (process.env.NODE_ENV !== "development") {
  // assuming production, set up a particular config and allow only requests from
  // the current URL to be consumed
  const whitelist = [
    'https://jobsboard.csesoc.unsw.edu.au'
  ];
  const corsOptions = {
    origin: (origin: any, callback: Function) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }
}

app.options("*", cors(corsOptions));

const activeEntities = [
  Company,
  CompanyAccount,
  Job,
  Student,
  AdminAccount,
  MailRequest,
  Logs,
];

// swagger api generator based on jsdoc
const swaggerjsdocOptions: any = {
  apis: ["./dist/**/*.js"],
  swaggerDefinition: {
    info: {
      description: "API for the CSESoc Jobs Board site with autogenerated swagger doc",
      title: "Jobs Board API",
      version: "1.0.0",
    },
  },
};

const specs = swaggerJsdoc(swaggerjsdocOptions);

const options: ConnectionOptions = {
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: activeEntities,
  migrations: [
  ],
  subscribers: [
  ],
};

async function bootstrap() {
  await createConnection(options);
  await seedDB(activeEntities);
}

/**
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         role:
 *           type: string
 *         company:
 *           type: integer
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         location:
 *           type: string
 *         description:
 *           type: string
 */

/**
 *  @swagger
 *  /jobs:
 *    get:
 *      description: List all active job posts
 *    responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Job'
 */
// NOTE: Temporarily deprecated in favour of pagination
// app.get("/jobs", Middleware.authenticateStudentMiddleware, StudentFunctions.GetAllActiveJobs);

/**
 *  @swagger
 *  /jobs/pending:
 *    get:
 *      description: List all pending (un-approved or un-rejected) job posts
 *    responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Job'
 *      400:
 *        description: Missing parameters or invalid credentials
 */
app.get(
  "/admin/jobs/pending",
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.GetPendingJobs,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /jobs/{offset}:
 *    get:
 *      description: List all active job post (paginated)
 *    responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Job'
 */
app.get(
  "/jobs/:offset",
  cors(corsOptions),
  Middleware.authenticateStudentMiddleware,
  StudentFunctions.GetPaginatedJobs,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /job/{jobID}:
 *    get:
 *      description: Get a specific job description
 *    responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Job'
 *      400:
 *        description: failed to find job
 */
app.get(
  "/job/:jobID",
  cors(corsOptions),
  Middleware.authenticateStudentMiddleware,
  StudentFunctions.GetJob,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /company/{companyID}:
 *    get:
 *      description: Get the information for a specific company
 *    responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Company'
 *      400:
 *        description: failed to find company
 */
app.get(
  "/company/:companyID",
  cors(corsOptions),
  Middleware.authenticateStudentMiddleware,
  CompanyFunctions.GetCompanyInfo,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /company/{companyID}/jobs:
 *    get:
 *      description: Get the jobs from a specific company
 *    responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Company'
 *      400:
 *        description: failed to find company
 */
app.get(
  "/company/:companyID/jobs",
  cors(corsOptions),
  Middleware.authenticateStudentMiddleware,
  CompanyFunctions.GetJobsFromCompany,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /authenticate/student:
 *    post:
 *      description: Authenticate a students credentials
 *    responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                token:
 *                  type: string
 *                  description: API token
 *      400:
 *        description: Missing parameters or invalid credentials
 */
app.post(
  "/authenticate/student",
  cors(corsOptions),
  Auth.AuthenticateStudent,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *
 *  /company:
 *    put:
 *      description: Create a company account
 *      parameters:
 *        - name: username
 *          description: The username of the new company account
 *          type: string
 *          required: true
 *        - name: password
 *          description: The associated password of the new company account
 *          type: string
 *          required: true
 *        - name: name
 *          description: The name of the new company
 *          type: string
 *          required: true
 *        - name: location
 *          description: The location of the new company
 *          type: string
 *          required: true
 *    responses:
 *      200:
 *        description: success
 *      400:
 *        description: Missing parameters
 *      409:
 *        description: Conflicting usernames
 */
app.put(
  "/company",
  cors(corsOptions),
  CompanyFunctions.CreateCompany,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /authenticate/company:
 *    post:
 *      description: Authenticate a company's credentials
 *    responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                token:
 *                  type: string
 *                  description: API token
 *      400:
 *        description: Missing parameters or invalid credentials
 */
app.post(
  "/authenticate/company",
  cors(corsOptions),
  Auth.AuthenticateCompany,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /jobs:
 *    put:
 *      description: Create a job as the logged in company
 *      parameters:
 *        - name: role
 *          description: The role of the job post
 *          type: string
 *          required: true
 *        - name: description
 *          description: A description fo the job
 *          type: string
 *          required: true
 *    responses:
 *      200:
 *        description: success
 *      400:
 *        description: Missing parameters or unauthorized
 */
app.put(
  "/jobs",
  cors(corsOptions),
  Middleware.authenticateCompanyMiddleware,
  CompanyFunctions.CreateJob,
  Middleware.genericLoggingMiddleware
);

/**
*  @swagger
*  /company/forgot:
*    post:
*      description: Send mail to company account to reset password
*      parameters:
*        - name: username
*          description: The username of the company account
*          type: string
*          required: true
*    responses:
*      200:
*        description: success
*      400:
*        description: failed to find company account
*/
app.post(
  "/company/forgot-password",
  cors(corsOptions),
  CompanyFunctions.SendResetPasswordEmail,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /authenticate/admin:
 *    post:
 *      description: Authenticate an admin's credentials
 *    responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                token:
 *                  type: string
 *                  description: API token
 *      400:
 *        description: Missing parameters or invalid credentials
 */
app.post(
  "/authenticate/admin",
  cors(corsOptions),
  Auth.AuthenticateAdmin,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /job/:jobID/approve:
 *    patch:
 *      description: Approve a job request as the admin
 *    responses:
 *      200:
 *        description: success
 *      400:
 *        description: Missing parameters or invalid credentials
 */
app.patch(
  "/job/:jobID/approve",
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.ApproveJobRequest,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /job/:jobID/approve:
 *    patch:
 *      description: Approve a job request as the admin
 *    responses:
 *      200:
 *        description: success
 *      400:
 *        description: Missing parameters or invalid credentials
 */
app.patch(
  "/job/:jobID/reject",
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.RejectJobRequest,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /admin/pending/companies:
 *    post:
 *      description: List all pending (non-verified) company accounts
 *    responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Company'
 *      400:
 *        description: Missing parameters or invalid credentials
 */
app.get(
  "/admin/pending/companies",
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.GetPendingCompanyVerifications,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /admin/company/:companyID/verify:
 *    patch:
 *      description: Verify a specific company account as an admin
 *    responses:
 *      200:
 *        description: success
 *      400:
 *        description: Missing parameters or invalid credentials
 */
app.patch(
  "/admin/company/:companyAccountID/verify",
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.VerifyCompanyAccount,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /companyjobs:
 *    get:
 *      description: Get all submitted from a specific company
 *    responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Job'
 *      400:
 *        description: failed to find company
 */
app.get(
  "/companyjobs",
  cors(corsOptions),
  Middleware.authenticateCompanyMiddleware,
  CompanyFunctions.GetAllJobsFromCompany,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /company/job/:jobID:
 *    delete:
 *      description: Delete a job post request from a company
 *    responses:
 *      200:
 *        description: success
 *      403:
 *        description: failed to delete job as it does not belong to company
 */
app.delete(
  "/company/job/:jobID",
  cors(corsOptions),
  Middleware.authenticateCompanyMiddleware,
  CompanyFunctions.MarkJobPostRequestAsDeleted,
  Middleware.genericLoggingMiddleware
);

/**
 *  @swagger
 *  /admin/companies:
 *    get:
 *      description: Get a list of all onboarded companies as an admin
 *    responses:
 *      200:
 *        description: success
 *      401:
 *        description: bad permissions
 */
app.get(
  "/admin/companies",
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.ListAllCompaniesAsAdmin,
  Middleware.genericLoggingMiddleware
);
/**
 *  @swagger
 *  /admin/company/:companyID/jobs:
 *    delete:
 *      description: Create a job as an admin on behalf of a company account
 *    responses:
 *      200:
 *        description: success
 *      401:
 *        description: bad permissions
 */
app.put(
  "/admin/company/:companyID/jobs",
  cors(corsOptions),
  Middleware.authenticateAdminMiddleware,
  AdminFunctions.CreateJobOnBehalfOfExistingCompany,
  Middleware.genericLoggingMiddleware
);

/*
if (process.env.NODE_ENV === "development") {
  app.post("/email", MailFunctions.SendTestEmail);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
}
 */

app.listen(port, async () => {
  if (process.env.NODE_ENV === "development") {
    await bootstrap();
  } else {
    await createConnection(options);
  }
  if (process.env.NODE_ENV === "production") {
    MailFunctions.InitMailQueueScheduler(2000);
  }
  Logger.Info(`SERVER STARTED AT PORT=${port}`);
});
