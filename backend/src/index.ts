// modules
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
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

// custom middleware
import Middleware from "./middleware";

dotenv.config({ path: '../.env' });
Logger.Init();

const app = express();
const port = process.env.SERVER_PORT;
app.use(bodyParser.json());
app.use(helmet());
// app.options("*", cors());
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}

const activeEntities = [
  Company,
  CompanyAccount,
  Job,
  Student,
  AdminAccount,
  MailRequest,
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
  database: './db/prod.sqlite',
  entities: activeEntities,
  // logging: true,
  migrations: [
  ],
  subscribers: [
  ],
  synchronize: true,
  type: "sqlite",
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
app.get("/jobs/:offset", Middleware.authenticateStudentMiddleware, StudentFunctions.GetPaginatedJobs);

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
app.get("/job/:jobID", Middleware.authenticateStudentMiddleware, StudentFunctions.GetJob);

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
app.get("/company/:companyID", Middleware.authenticateStudentMiddleware, CompanyFunctions.GetCompanyInfo);

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
app.get("/company/:companyID/jobs", Middleware.authenticateStudentMiddleware, CompanyFunctions.GetJobsFromCompany);

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
app.post("/authenticate/student", Auth.AuthenticateStudent);

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
app.put("/company", CompanyFunctions.CreateCompany);

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
app.post("/authenticate/company", Auth.AuthenticateCompany);

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
app.put("/jobs", Middleware.authenticateCompanyMiddleware, CompanyFunctions.CreateJob);

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
app.post("/authenticate/admin", Auth.AuthenticateAdmin);

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
app.patch("/job/:jobID/approve", Middleware.authenticateAdminMiddleware, AdminFunctions.ApproveJobRequest);

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
app.patch("/job/:jobID/reject", Middleware.authenticateAdminMiddleware, AdminFunctions.RejectJobRequest);

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
app.get("/jobs/pending", Middleware.authenticateAdminMiddleware, AdminFunctions.GetPendingJobs);

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
app.get("/admin/pending/companies", Middleware.authenticateAdminMiddleware, AdminFunctions.GetPendingCompanyVerifications);

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
app.patch("/admin/company/:companyAccountID/verify", Middleware.authenticateAdminMiddleware, AdminFunctions.VerifyCompanyAccount);

if (process.env.NODE_ENV === "development") {
  app.post("/email", MailFunctions.SendTestEmail);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
}

app.use(Middleware.genericLoggingMiddleware);

app.listen(port, async () => {
  if (process.env.NODE_ENV === "development") {
    await bootstrap();
  }
  MailFunctions.InitMailQueueScheduler(500);
  Logger.Info(`Server started at ${port}`);
});
