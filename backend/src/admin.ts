import { Response, NextFunction } from 'express';
import { Brackets } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from './config';
import Job from './entity/job';
import Company from './entity/company';
import CompanyAccount from './entity/company_account';
import Statistics from './entity/statistics';
import Helpers, { IResponseWithStatus } from './helpers';
import MailFunctions from './mail';
import { Logger, LogModule } from './logging';
import {
  AdminJobRequest,
  GeneralAdminRequest,
  VerifyCompanyAccountRequest,
  UnverifyCompanyAccountRequest,
  AdminCreateJobRequest,
  AdminDeleteJobRequest,
  AdminApprovedJobPostsRequest,
} from './types/request';
import { env } from './environment';

const LM = new LogModule('ADMIN');

export default class AdminFunctions {
  public static async ApproveJobRequest(
    this: void,
    req: AdminJobRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async (): Promise<IResponseWithStatus> => {
        Logger.Info(LM, `Admin ID=${req.adminID} attempting to approve JOB=${req.params.jobID}`);
        Helpers.requireParameters(req.params.jobID);
        const jobID = Number(req.params.jobID);
        if (Number.isNaN(jobID)) {
          Logger.Info(LM, `Rejected jobID ${jobID} as it is not a numeric value`);
          return { status: StatusCodes.BAD_REQUEST, msg: undefined };
        }

        const jobToApprove = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .where('Job.approved = :approved', { approved: false })
            .andWhere('Job.hidden = :hidden', { hidden: false })
            .andWhere('Job.id = :id', { id: jobID })
            .getOne(),
          `Failed to find job ID=${jobID}`,
        );

        jobToApprove.company = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.createQueryBuilder().relation(Job, 'company').of(jobToApprove).loadOne(),
          `Failed to find company record owning JOB=${jobID}`,
        );

        jobToApprove.company.companyAccount = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.createQueryBuilder()
            .relation(Company, 'companyAccount')
            .of(jobToApprove.company)
            .loadOne(),
          `Failed to find company account owning JOB=${jobID}`,
        );

        await AppDataSource.createQueryBuilder()
          .update(Job)
          .set({ approved: true })
          .where('id = :id', { id: jobToApprove.id })
          .execute();

        // increment number of jobs approved for that year
        const jobCreatedYear = jobToApprove.createdAt.getFullYear();
        const numApprovedJobs = await AppDataSource.getRepository(Statistics)
          .createQueryBuilder('s')
          .where('s.year = :year', { year: jobCreatedYear })
          .getOne();

        if (numApprovedJobs === null) {
          await AppDataSource.createQueryBuilder()
            .insert()
            .into(Statistics)
            .values([{ year: jobCreatedYear, numJobPosts: 1 }])
            .execute();
        } else {
          await AppDataSource.createQueryBuilder()
            .update(Statistics)
            .set({ numJobPosts: () => 'numJobPosts + 1' })
            .where('year = :year', { year: jobCreatedYear })
            .execute();
        }

        await MailFunctions.AddMailToQueue(
          jobToApprove.company.companyAccount.username,
          'DevSoc Jobs Board - Job Post request approved',
          `
        Congratulations! Your job post request titled "${jobToApprove.role}" has been approved. UNSW CSE students are now able to view the posting.
          <br>
        <p>Best regards,</p>
        <p>DevSoc Jobs Board Administrators</p>
        `,
        );
        Logger.Info(LM, `Admin ID=${req.adminID} approved JOB=${req.params.jobID}`);
        return {
          status: StatusCodes.OK,
          msg: { token: req.newJbToken },
        };
      },
      () => ({
        status: StatusCodes.BAD_REQUEST,
        msg: { token: req.newJbToken },
      }),
      next,
    );
  }

  public static async RejectJobRequest(
    this: void,
    req: AdminJobRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async (): Promise<IResponseWithStatus> => {
        Logger.Info(LM, `Admin ID=${req.adminID} attempting to reject JOB=${req.params.jobID}`);
        Helpers.requireParameters(req.params.jobID);
        const jobID = Number(req.params.jobID);
        if (Number.isNaN(jobID)) {
          return { status: StatusCodes.BAD_REQUEST, msg: undefined };
        }

        const jobToReject = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .where('Job.approved = :approved', { approved: false })
            .andWhere('Job.hidden = :hidden', { hidden: false })
            .andWhere('Job.id = :id', { id: jobID })
            .getOne(),
          `Failed to find job ID=${jobID}`,
        );

        jobToReject.company = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.createQueryBuilder().relation(Job, 'company').of(jobToReject).loadOne(),
          `Failed to find company record owning JOB=${jobID}`,
        );

        jobToReject.company.companyAccount = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.createQueryBuilder()
            .relation(Company, 'companyAccount')
            .of(jobToReject.company)
            .loadOne(),
          `Failed to find company account owning JOB=${jobID}`,
        );

        await AppDataSource.createQueryBuilder()
          .update(Job)
          .set({ hidden: true })
          .where('id = :id', { id: jobToReject.id })
          .execute();

        await MailFunctions.AddMailToQueue(
          jobToReject.company.companyAccount.username,
          'DevSoc Jobs Board - Job Post request rejected',
          `
You job post request titled "${jobToReject.role}" has been rejected as it does not follow our <a href="">job post guidelines</a>. You are more than welcome to re-submit a revised version of the job application that better follows the aforementioned guidelines.
          <br>
        <p>Best regards,</p>
        <p>DevSoc Jobs Board Administrators</p>
        `,
        );
        Logger.Info(LM, `Admin ID=${req.adminID} attempting to reject JOB=${req.params.jobID}`);
        return {
          status: StatusCodes.OK,
          msg: { token: req.newJbToken },
        };
      },
      () => ({
        status: StatusCodes.BAD_REQUEST,
        msg: { token: req.newJbToken },
      }),
      next,
    );
  }

  public static async GetPendingJobs(
    this: void,
    req: AdminJobRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async (): Promise<IResponseWithStatus> => {
        Logger.Info(LM, `ADMIN=${req.adminID} attempting to query pending jobs`);
        const pendingJobs = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .select([
              'Job.id',
              'Job.role',
              'Job.description',
              'Job.applicationLink',
              'Job.approved',
              'Job.hidden',
              'Job.expiry',
              'Job.mode',
              'Job.studentDemographic',
              'Job.jobType',
              'Job.workingRights',
              'Job.wamRequirements',
              'Job.additionalInfo',
              'Job.isPaid',
            ])
            .where('Job.approved = :approved', { approved: false })
            .andWhere('Job.hidden = :hidden', { hidden: false })
            .innerJoinAndSelect('Job.company', 'c')
            .getMany(),
          "Couldn't find any pending job requests.",
        );
        return {
          status: StatusCodes.OK,
          msg: { token: req.newJbToken, pendingJobs },
        };
      },
      () => ({
        status: StatusCodes.BAD_REQUEST,
        msg: { token: req.newJbToken },
      }),
      next,
    );
  }

  public static async GetPendingCompanyVerifications(
    this: void,
    req: GeneralAdminRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async (): Promise<IResponseWithStatus> => {
        Logger.Info(LM, `ADMIN=${req.adminID} attempting to query pending companies`);
        const pendingCompanyVerifications = await Helpers.doSuccessfullyOrFail(async () => {
          const pendingCompanyAccounts = await AppDataSource.getRepository(CompanyAccount)
            .createQueryBuilder()
            .select(['CompanyAccount.id', 'CompanyAccount.username'])
            .where('CompanyAccount.verified = :verified', { verified: false })
            .innerJoinAndSelect('CompanyAccount.company', 'c')
            .getMany();
          return pendingCompanyAccounts;
        }, "Couldn't find any pending company verifications.");
        return {
          status: StatusCodes.OK,
          msg: { token: req.newJbToken, pendingCompanyVerifications },
        };
      },
      () => ({
        status: StatusCodes.BAD_REQUEST,
        msg: { token: req.newJbToken },
      }),
      next,
    );
  }

  public static async VerifyCompanyAccount(
    this: void,
    req: VerifyCompanyAccountRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async (): Promise<IResponseWithStatus> => {
        Logger.Info(
          LM,
          `Admin ID=${req.adminID} attempting to verify COMPANY=${req.params.companyAccountID}`,
        );
        const pendingCompany = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(CompanyAccount)
            .createQueryBuilder()
            .where('CompanyAccount.id = :id', { id: req.params.companyAccountID })
            .andWhere('CompanyAccount.verified = :verified', { verified: false })
            .getOne(),
          `Couldn't find any pending company verifications for COMPANY_ACCOUNT=${req.params.companyAccountID}.`,
        );

        await AppDataSource.createQueryBuilder()
          .update(CompanyAccount)
          .set({ verified: true })
          .where('id = :id', { id: pendingCompany.id })
          .execute();

        // send an email confirming that the account has been verified
        await MailFunctions.AddMailToQueue(
          pendingCompany.username,
          'DevSoc Jobs Board - Success! Your account has been verified',
          `

        Congratulations! Your company account creation has been successful. You are now able to post job requests on the DevSoc Jobs Board. The process for doing so is as follows:
            <ul>
              <li>
                Log in to the company account portal
              </li>
              <li>
                Click on "Post Jobs"
              </li>
              <li>
                Fill in the required information to post a job
              </li>
              <li>
                Once the Adminstrator has approved your job post, it will then be made available to students - If it is rejected, it will be due to it not following the job posting guidelines
              </li>
              <li>
                You may request to post multiple jobs at one time, but please refrain from posting the same job multiple times as duplicates will not be approved
              </li>
            </ul>
          <br>
        <p>Best regards,</p>
        <p>DevSoc Jobs Board Administrators</p>
        `,
        );
        Logger.Info(LM, `Admin ID=${req.adminID} verified COMPANY=${req.params.companyAccountID}`);
        return {
          status: StatusCodes.OK,
          msg: { token: req.newJbToken },
        };
      },
      () => ({
        status: StatusCodes.BAD_REQUEST,
        msg: { token: req.newJbToken },
      }),
      next,
    );
  }

  public static async UnverifyCompanyAccount(
    this: void,
    req: UnverifyCompanyAccountRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(
          LM,
          `Admin ID=${req.adminID} attempting to unverify COMPANY=${req.params.companyAccountID}`,
        );
        const pendingCompany = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(CompanyAccount)
            .createQueryBuilder()
            .where('CompanyAccount.id = :id', { id: req.params.companyAccountID })
            .andWhere('CompanyAccount.verified = :verified', { verified: true })
            .getOne(),
          `Couldn't find a verified company for COMPANY_ACCOUNT=${req.params.companyAccountID}.`,
        );

        await AppDataSource.createQueryBuilder()
          .update(CompanyAccount)
          .set({ verified: false })
          .where('id = :id', { id: pendingCompany.id })
          .execute();

        // Unapprove all jobs associated with company
        await AppDataSource.createQueryBuilder()
          .update(Job)
          .set({ approved: false })
          .where('company.id = :companyId', { companyId: pendingCompany.id })
          .execute();

        // send an email confirming that the company has been unverified
        await MailFunctions.AddMailToQueue(
          pendingCompany.username,
          'DevSoc Jobs Board - Your account has been unverified',
          `
          Your company account has been unverified. If you believe that there has been an error or you would like to understand the reasons behind the unverification, we encourage you to get in touch with us.
          <br>
          <p>Best regards,</p>
          <p>DevSoc Jobs Board Administrators</p>
          `,
        );
        Logger.Info(LM, `Admin ID=${req.adminID} unverified COMPANY=${req.params.companyAccountID}`);
        return {
          status: 200,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      () => ({
        status: 400,
        msg: {
          token: req.newJbToken,
        },
      } as IResponseWithStatus),
      next,
    );
  }

  public static async ListAllCompaniesAsAdmin(
    this: void,
    req: GeneralAdminRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async (): Promise<IResponseWithStatus> => {
        Logger.Info(LM, `Admin ID=${req.adminID} attempting to query all companies`);

        const companyAccounts = await AppDataSource.getRepository(CompanyAccount)
          .createQueryBuilder()
          .where('CompanyAccount.verified = :verified', { verified: true })
          .innerJoinAndSelect('CompanyAccount.company', 'c')
          .getMany();

        const fixedCompanies = companyAccounts.map((companyAccount) => ({
          id: companyAccount.company.id,
          name: companyAccount.company.name,
          location: companyAccount.company.location,
          logo: companyAccount.company.logo,
          username: companyAccount.username,
          createdAt: companyAccount.company.createdAt,
          description: companyAccount.company.description,
        }));

        return {
          status: StatusCodes.OK,
          msg: { companies: fixedCompanies },
        };
      },
      () => ({
        status: StatusCodes.BAD_REQUEST,
        msg: { token: req.newJbToken },
      }),
      next,
    );
  }

  public static async CreateJobOnBehalfOfExistingCompany(
    this: void,
    req: AdminCreateJobRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async (): Promise<IResponseWithStatus> => {
        const { companyID } = req.params;
        Logger.Info(LM, `Admin ID=${req.adminID} attempting to find company ID=${companyID}`);
        const company = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(Company)
            .createQueryBuilder()
            .where('Company.id = :id', { id: companyID })
            .getOne(),
          `Couldn't get request company object ID=${companyID} as Admin ID=${req.adminID}`,
        );

        // get it's associated company account to verify
        company.companyAccount = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.createQueryBuilder()
            .relation(Company, 'companyAccount')
            .of(company)
            .loadOne(),
          `Could not get the related company account for company ID=${company.id}`,
        );

        company.jobs = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.createQueryBuilder().relation(Company, 'jobs').of(company).loadMany(),
          `Failed to find jobs for COMPANY_ACCOUNT=${companyID}`,
        );

        // verify whether the associated company account is verified
        if (!company.companyAccount.verified) {
          throw new Error(
            `Admin ID=${req.adminID} attempted to create a job post for company ID=${companyID} however it was not a verified company`,
          );
        }

        // create the job now
        // ensure required parameters are present
        const msg = {
          applicationLink: req.body.applicationLink.trim(),
          description: req.body.description.trim(),
          role: req.body.role.trim(),
          expiry: req.body.expiry,
          jobMode: req.body.jobMode,
          studentDemographic: req.body.studentDemographic,
          jobType: req.body.jobType,
          workingRights: req.body.workingRights,
          wamRequirements: req.body.wamRequirements,
          additionalInfo: req.body.additionalInfo.trim(),
          isPaid: req.body.isPaid,
        };

        Helpers.requireParameters(msg.role);
        Helpers.requireParameters(msg.description);
        Helpers.requireParameters(msg.applicationLink);
        Helpers.requireParameters(msg.expiry);
        Helpers.requireParameters(msg.isPaid);

        Helpers.isValidJobMode(msg.jobMode);
        Helpers.isValidStudentDemographic(msg.studentDemographic);
        Helpers.isValidJobType(msg.jobType);
        Helpers.isValidWorkingRights(msg.workingRights);
        Helpers.isValidWamRequirement(msg.wamRequirements);

        Helpers.isDateInTheFuture(msg.expiry);
        Helpers.validApplicationLink(msg.applicationLink);
        Logger.Info(
          LM,
          `Attempting to create job for COMPANY=${companyID} with ROLE=${msg.role} DESCRIPTION=${msg.description} applicationLink=${msg.applicationLink} as adminID=${req.adminID}`,
        );

        const newJob = new Job();
        newJob.role = msg.role;
        newJob.description = msg.description;
        newJob.applicationLink = msg.applicationLink;
        newJob.expiry = new Date(msg.expiry);
        newJob.mode = msg.jobMode;
        newJob.studentDemographic = msg.studentDemographic;
        newJob.jobType = msg.jobType;
        newJob.workingRights = msg.workingRights;
        newJob.additionalInfo = msg.additionalInfo;
        newJob.isPaid = msg.isPaid;
        newJob.wamRequirements = msg.wamRequirements;
        // jobs created by admin are implicitly approved
        newJob.approved = true;
        // mark this job as one that the admin has created
        newJob.adminCreated = true;

        await MailFunctions.AddMailToQueue(
          env.MAIL_USERNAME,
          'DevSoc Jobs Board - DevSoc has created a job on your behalf',
          `
        Congratulations! DevSoc has create a job post on your behalf titled "${newJob.role}". UNSW DevSoc students are now able to view the posting.
          <br>
        <p>Best regards,</p>
        <p>DevSoc Jobs Board Administrators</p>
        `,
        );

        company.jobs.push(newJob);

        await AppDataSource.manager.save(company);

        const newJobID: number = company.jobs[company.jobs.length - 1].id;
        Logger.Info(
          LM,
          `Created JOB=${newJobID} for COMPANY_ACCOUNT=${companyID} as adminID=${req.adminID}`,
        );

        // check to see if that job is queryable
        await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .where('Job.id = :id', { id: newJobID })
            .getOne(),
          `Failed to fetch the newly created JOB=${newJobID}`,
        );

        return {
          status: StatusCodes.OK,
          msg: { token: req.newJbToken },
        };
      },
      () => ({
        status: StatusCodes.BAD_REQUEST,
        msg: { token: req.newJbToken },
      }),
      next,
    );
  }

  public static async DeleteJobOnBehalfOfExistingCompany(
    this: void,
    req: AdminDeleteJobRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async (): Promise<IResponseWithStatus> => {
        const { companyID, jobId } = req.params;
        Logger.Info(LM, `Admin ID=${req.adminID} attempting to find company ID=${companyID}`);
        const company = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(Company)
            .createQueryBuilder()
            .where('Company.id = :id', { id: companyID })
            .getOne(),
          `Couldn't get request company object ID=${companyID} as Admin ID=${req.adminID}`,
        );

        // get it's associated company account to verify
        company.companyAccount = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.createQueryBuilder()
            .relation(Company, 'companyAccount')
            .of(company)
            .loadOne(),
          `Could not get the related company account for company ID=${company.id}`,
        );

        // delete this job in the company's jobs relation
        await AppDataSource.getRepository(Company)
          .createQueryBuilder('company')
          .delete()
          .relation(Company, 'companyAccount')
          .of(company)
          .where('Job.id = :id', { id: jobId }),
        );

        // verify whether the associated company account is verified
        if (!company.companyAccount.verified) {
          throw new Error(
            `Admin ID=${req.adminID} attempted to create a job post for company ID=${companyID} however it was not a verified company`,
          );
        }

        await AppDataSource.manager.save(company);


        // check to see if that job is queryable
        await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .where('Job.id = :id', { id: jobId })
            .getOne(),
          `Successfully deleted the JOB=${jobId}`,
        );

        return {
          status: StatusCodes.OK,
          msg: { token: req.newJbToken },
        };
      },
      () => ({
        status: StatusCodes.BAD_REQUEST,
        msg: { token: req.newJbToken },
      }),
      next,
    );
  }

  public static async GetNumVerifiedCompanies(
    this: void,
    req: GeneralAdminRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async (): Promise<IResponseWithStatus> => {
        Logger.Info(LM, `Retrieving the number of verified companies as ADMIN=${req.adminID}`);

        const verifiedCompanies = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(CompanyAccount)
            .createQueryBuilder('ca')
            .where('ca.verified = :verified', { verified: true })
            .getMany(),
          'Failed to retrive the number of verified comapnies',
        );

        const numVerifiedCompanies = verifiedCompanies.length;

        Logger.Info(
          LM,
          `Successfully retrived the number of verified comapanies as ADMIN=${req.adminID}`,
        );

        return {
          status: StatusCodes.OK,
          msg: { num: numVerifiedCompanies },
        };
      },
      () => ({ status: StatusCodes.BAD_REQUEST, msg: undefined }),
      next,
    );
  }

  public static async getNumApprovedJobPosts(
    this: void,
    req: AdminApprovedJobPostsRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async (): Promise<IResponseWithStatus> => {
        Logger.Info(
          LM,
          `Retrieving the number of approved jobs in YEAR=${new Date().getFullYear()} as ADMIN=${
            req.adminID
          }`,
        );

        const yearToSearch = parseInt(req.params.year, 10);
        Helpers.requireParameters(yearToSearch);

        const numApprovedJobs = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(Statistics)
            .createQueryBuilder('s')
            .select(['s.numJobPosts'])
            .where('s.year = :year', { year: yearToSearch })
            .getOne(),
          `Failed to retrieve the number of approved job posts for YEAR=${yearToSearch}`,
        );

        // number of job posts for the provided year hasn't been recorded yet
        if (numApprovedJobs === null) {
          // query all jobs => update statistics table => return value
          const allApprovedJobs = await Helpers.doSuccessfullyOrFail(
            async () => AppDataSource.getRepository(Job)
              .createQueryBuilder('j')
              .select(['j.id', 'j.createdAt'])
              .where('j.approved = :approved', { approved: true })
              .andWhere('j.deleted = :deleted', { deleted: false })
              .getMany(),
            'Failed to retrive the number of approved posts in the db',
          );

          const allApprovedJobsThatYear = allApprovedJobs.filter(
            (job) => job.createdAt.getFullYear() === yearToSearch,
          );
          const numJobsPostsinYear = allApprovedJobsThatYear.length;

          await AppDataSource.createQueryBuilder()
            .insert()
            .into(Statistics)
            .values([{ year: yearToSearch, numJobPosts: numJobsPostsinYear }])
            .execute();

          Logger.Info(
            LM,
            `Sucessfully retrieved the number of approved jobs in YEAR=${new Date().getFullYear()} as ADMIN=${
              req.adminID
            }`,
          );
          return {
            status: StatusCodes.OK,
            msg: { numJobPosts: numJobsPostsinYear },
          };
        }
        Logger.Info(
          LM,
          `Sucessfully retriveved the number of approved jobs in YEAR=${new Date().getFullYear()} as ADMIN=${
            req.adminID
          }`,
        );
        return {
          status: StatusCodes.OK,
          msg: { numJobPosts: numApprovedJobs.numJobPosts },
        };
      },
      () => ({ status: StatusCodes.BAD_REQUEST, msg: undefined }),
      next,
    );
  }

  public static async GetAllHiddenJobs(
    this: void,
    req: GeneralAdminRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async (): Promise<IResponseWithStatus> => {
        const { adminID } = req;
        Helpers.requireParameters(adminID);

        Logger.Info(LM, `ADMIN=${adminID} attempting to list all hidden jobs in the database`);

        const hiddenJobs = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .leftJoinAndSelect('Job.company', 'company')
            .where(
              new Brackets((q) => {
                q.where('Job.deleted = :deleted', { deleted: true })
                  .orWhere('Job.expiry <= :expiry', { expiry: new Date() })
                  .orWhere('Job.hidden = :hidden', { hidden: true });
              }),
            )
            .select([
              'company.name',
              'Job.id',
              'Job.role',
              'Job.description',
              'Job.applicationLink',
              'Job.approved',
              'Job.hidden',
              'Job.mode',
              'Job.studentDemographic',
              'Job.jobType',
              'Job.workingRights',
              'Job.wamRequirements',
              'Job.additionalInfo',
              'Job.isPaid',
              'Job.expiry',
              'Job.deleted',
            ])
            .orderBy('company.name', 'ASC')
            .orderBy('Job.createdAt', 'DESC')
            .getMany(),
          'Failed to find jobs',
        );

        // group jobs by company name
        const resMap = new Map<string, Job[]>();
        hiddenJobs.forEach((job) => {
          const key = String(job.company.name);
          if (!resMap.has(key)) {
            resMap.set(key, []);
          }
          resMap.get(key).push(job);
        });

        Logger.Info(LM, `ADMIN=${adminID} successfully to retrieved all the hidden jobs`);

        return {
          status: StatusCodes.OK,
          msg: {
            token: req.newJbToken,
            hiddenJobs: resMap,
          },
        };
      },
      () => ({
        status: StatusCodes.BAD_REQUEST,
        msg: { token: req.newJbToken },
      }),
      next,
    );
  }
}
