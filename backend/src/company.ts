import { Response, NextFunction } from 'express';
import { Brackets } from 'typeorm';
import { AppDataSource } from './config';
import Company from './entity/company';
import CompanyAccount from './entity/company_account';
import Job from './entity/job';
import Helpers, { IResponseWithStatus } from './helpers';
import Secrets from './secrets';
import MailFunctions from './mail';
import Logger from './logging';
import { AccountType, IToken } from './auth';
import JWT from './jwt';
import {
  CompanyInfoRequest,
  CompanyJobsRequest,
  CreateCompanyRequest,
  CreateJobRequest,
  GetHiddenJobsRequest,
  JobInfo,
  EditJobRequest,
  CompanyGetJobsRequest,
  DeleteJobRequest,
  CompanyResetPasswordEmailRequest,
  CompanyGetResetTokenRequest,
  CompanyResetPasswordRequest,
  CompanyUploadLogoRequest,
  CheckCompanyLogoRequest,
  UpdateCompanyDetailsRequest,
} from './interfaces/interfaces';

export default class CompanyFunctions {
  public static async GetCompanyInfo(
    this: void,
    req: CompanyInfoRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(
          `STUDENT=${req.studentZID} getting company info for COMPANY=${req.params.companyID}`,
        );
        const companyInfo = await AppDataSource.getRepository(Company)
          .createQueryBuilder()
          .select(['Company.name', 'Company.location', 'Company.description'])
          .leftJoinAndSelect('Company.jobs', 'Job')
          .where('Company.id = :id', { id: parseInt(req.params.companyID, 10) })
          .getOne();

        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            companyInfo,
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

  public static async GetJobsFromCompany(
    this: void,
    req: CompanyJobsRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(`STUDENT=${req.studentZID} getting jobs for COMPANY=${req.params.companyID}`);
        const companyJobs = await AppDataSource.getRepository(Job)
          .createQueryBuilder()
          .leftJoinAndSelect('Job.company', 'company')
          .where('company.id = :id', { id: parseInt(req.params.companyID, 10) })
          .andWhere('Job.approved = :approved', { approved: true })
          .andWhere('Job.hidden = :hidden', { hidden: false })
          .andWhere('Job.deleted = :deleted', { deleted: false })
          .andWhere('Job.expiry > :expiry', { expiry: new Date() })
          .select([
            'Job.id',
            'Job.role',
            'Job.description',
            'Job.applicationLink',
            'Job.mode',
            'Job.studentDemographic',
            'Job.jobType',
            'Job.workingRights',
            'Job.wamRequirements',
            'Job.additionalInfo',
            'Job.isPaid',
          ])
          .getMany();

        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            companyJobs,
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

  public static async CreateCompany(
    this: void,
    req: CreateCompanyRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        const msg = {
          location: req.body.location,
          name: req.body.name,
          password: req.body.password,
          username: req.body.username,
          logo: req.body.logo,
        };

        Helpers.requireParameters(msg.username);
        Helpers.requireParameters(msg.password);
        Helpers.requireParameters(msg.name);
        Helpers.requireParameters(msg.location);
        Helpers.requireParameters(msg.logo);

        Logger.Info(
          `Attempting to create company with USERNAME=${msg.username} NAME=${msg.name} LOCATION=${msg.location}`,
        );
        // check if the company account exists with the same name
        // using the original typeorm OR convention fails to construct a suitable MySQL
        // query, so we have to do this in two separate queries
        const companyAccountUsernameSearchResult = await AppDataSource.getRepository(CompanyAccount)
          .createQueryBuilder('company_account')
          .where('company_account.username = :username', { username: msg.username })
          .getOne();
        const companyNameSearchResult = await AppDataSource.getRepository(Company)
          .createQueryBuilder('company')
          .where('company.name = :name', { name: msg.name })
          .getOne();
        if (companyAccountUsernameSearchResult !== null || companyNameSearchResult !== null) {
          // company exists, send conflict error
          return {
            status: 409,
            msg: undefined,
          } as IResponseWithStatus;
        }

        const newCompany = new Company();
        newCompany.name = msg.name;
        newCompany.location = msg.location;
        newCompany.logo = Buffer.from(msg.logo, 'utf8');

        const newCompanyAccount = new CompanyAccount();
        newCompanyAccount.username = msg.username;
        newCompanyAccount.hash = Secrets.hash(msg.password);
        newCompanyAccount.company = newCompany;
        newCompany.companyAccount = newCompanyAccount;

        const companyAccountRepository = AppDataSource.getRepository(CompanyAccount);

        // ? does the single save also add newCompany to the db? (need investigation)
        await companyAccountRepository.save(newCompanyAccount);

        Logger.Info(
          `Created company with USERNAME=${msg.username} NAME=${msg.name} LOCATION=${msg.location}`,
        );

        await MailFunctions.AddMailToQueue(
          newCompanyAccount.username,
          'Thank you for adding your company to the CSESoc Jobs Board',
          `
        Thank you for registering your company with the CSESoc Jobs Board. We really appreciate your time and are looking forward to working with you to share amazing opportunities with our students.
            <br>
          Please contact our executive committee at <a href="mailto:careers@csesoc.org.au">careers@csesoc.org.au</a> to verify your company account.
          <br>
        <p>Best regards,</p>
        <p>Adam Tizzone</p>
        <p>CSESoc Jobs Board Administrator</p>
        `,
        );
        return {
          status: 200,
          msg: undefined,
        } as IResponseWithStatus;
      },
      () => ({
        status: 400,
        msg: undefined,
      } as IResponseWithStatus),
      next,
    );
  }

  public static async CreateJob(
    this: void,
    req: CreateJobRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        if (req.companyAccountID === undefined) {
          return {
            status: 401,
            msg: {
              token: req.newJbToken,
            },
          } as IResponseWithStatus;
        }
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

        // ? double check data sent from frontend are guaranteed valid before removing
        Helpers.requireParameters(msg.role);
        Helpers.requireParameters(msg.description);
        Helpers.requireParameters(msg.applicationLink);
        Helpers.requireParameters(msg.expiry);
        Helpers.requireParameters(msg.isPaid);
        Helpers.isDateInTheFuture(msg.expiry);
        Helpers.validApplicationLink(msg.applicationLink);

        Logger.Info(
          `Attempting to create job for COMPANY=${req.companyAccountID} with ROLE=${msg.role} DESCRIPTION=${msg.description} applicationLink=${msg.applicationLink}`,
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
        newJob.isPaid = msg.isPaid;
        newJob.additionalInfo = msg.additionalInfo;
        newJob.wamRequirements = msg.wamRequirements;

        // get the company and the list of its jobs
        const companyAccount: CompanyAccount = await AppDataSource.getRepository(CompanyAccount)
          .createQueryBuilder()
          .leftJoinAndSelect('CompanyAccount.company', 'company')
          .leftJoinAndSelect('company.jobs', 'job')
          .where('CompanyAccount.id = :id', { id: req.companyAccountID })
          .andWhere('CompanyAccount.verified = :verified', { verified: true })
          .getOne();

        // prevent job from being posted since the provided company account is not verified
        if (companyAccount === null) {
          return {
            status: 403,
            msg: {
              token: req.newJbToken,
            },
          } as IResponseWithStatus;
        }

        // add the new job to the list and commit to db
        companyAccount.company.jobs.push(newJob);
        await AppDataSource.manager.save(companyAccount);

        // get the supposed id for the new job and check if it's queryable from the db
        const newJobID = companyAccount.company.jobs[companyAccount.company.jobs.length - 1].id;

        Logger.Info(`Created JOB=${newJobID} for COMPANY_ACCOUNT=${req.companyAccountID}`);

        await AppDataSource.getRepository(Job)
          .createQueryBuilder()
          .where('Job.id = :id', { id: newJobID })
          .getOne();

        await MailFunctions.AddMailToQueue(
          companyAccount.username,
          'CSESoc Jobs Board - Job Post request submitted',
          `
        Thank you for adding a job post to the CSESoc Jobs Board. As part of our aim to ensure student safety, we check all job posting requests to ensure they follow our guidelines, as the safety of our students is our utmost priority.
            <br>
          A result will be sent to you shortly.
          <br>
        <p>Best regards,</p>
        <p>Adam Tizzone</p>
        <p>CSESoc Jobs Board Administrator</p>
        `,
        );
        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            id: newJobID,
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

  public static async GetCompanyHiddenJobs(
    this: void,
    req: GetHiddenJobsRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        const companyID = req.companyAccountID;
        Helpers.requireParameters(companyID);

        Logger.Info(`COMPANY_ACCOUNT=${req.companyID} attempting to list all of its hidden jobs`);

        const hiddenJobs = await AppDataSource.getRepository(Job)
          .createQueryBuilder()
          .leftJoinAndSelect('Job.company', 'company')
          .where('company.id = :id', { id: parseInt(req.companyAccountID, 10) })
          .andWhere(
            new Brackets((q) => {
              q.where('Job.deleted = :deleted', { deleted: true })
                .orWhere('Job.expiry <= :expiry', { expiry: new Date() })
                .orWhere('Job.hidden = :hidden', { hidden: true });
            }),
          )
          .orderBy('Job.createdAt', 'DESC')
          .select([
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
          .getMany();

        Logger.Info(
          `COMPANY_ACCOUNT=${req.companyID} successfully to retrieved all of its hidden jobs`,
        );

        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            hiddenJobs,
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

  private static isJobUpdated(newJob: Job, jobInfo: JobInfo) {
    const areArraysEquals = (a: unknown[], b: unknown[]) => Array.isArray(a)
      && Array.isArray(b)
      && a.length === b.length
      && a.every((val, index) => val === b[index]);

    if (!areArraysEquals(newJob.studentDemographic, jobInfo.studentDemographic)) {
      return false;
    }
    if (!areArraysEquals(newJob.workingRights, jobInfo.workingRights)) {
      return false;
    }

    return (
      newJob !== null
      && newJob.role === jobInfo.role
      && newJob.description === jobInfo.description
      && newJob.applicationLink === jobInfo.applicationLink
      && new Date(newJob.expiry).valueOf() === new Date(jobInfo.expiry).valueOf()
      && newJob.mode === jobInfo.jobMode
      && newJob.jobType === jobInfo.jobType
      && newJob.isPaid === jobInfo.isPaid
      && newJob.additionalInfo === jobInfo.additionalInfo
      && newJob.wamRequirements === jobInfo.wamRequirements
    );
  }

  public static async EditJob(this: void, req: EditJobRequest, res: Response, next: NextFunction) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        const companyId = req.companyAccountID;
        Helpers.requireParameters(companyId);

        const jobInfo = {
          id: req.body.id,
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

        // verify that the required parameters exist and are valid
        Helpers.requireParameters(jobInfo.id);
        Helpers.requireParameters(jobInfo.role);
        Helpers.requireParameters(jobInfo.description);
        Helpers.requireParameters(jobInfo.applicationLink);
        Helpers.requireParameters(jobInfo.expiry);
        Helpers.requireParameters(jobInfo.isPaid);

        Helpers.isValidJobMode(jobInfo.jobMode);
        Helpers.isValidStudentDemographic(jobInfo.studentDemographic);
        Helpers.isValidJobType(jobInfo.jobType);
        Helpers.isValidWorkingRights(jobInfo.workingRights);
        Helpers.isValidWamRequirement(jobInfo.wamRequirements);

        Helpers.isDateInTheFuture(jobInfo.expiry);
        Helpers.validApplicationLink(jobInfo.applicationLink);

        Logger.Info(`COMPANY=${companyId} attempting to edit JOB=${jobInfo.id}`);

        // verify that job x belongs to the company
        const oldJob = await AppDataSource.getRepository(Job)
          .createQueryBuilder()
          .leftJoinAndSelect('Job.company', 'company')
          .where('company.id = :id', { id: parseInt(companyId, 10) })
          .andWhere('Job.id = :jobId', { jobId: jobInfo.id })
          .getOne();

        if (oldJob === null) {
          return {
            status: 403,
            msg: {
              token: req.newJbToken,
            },
          } as IResponseWithStatus;
        }

        // update the db
        await AppDataSource.getRepository(Job)
          .createQueryBuilder()
          .update(Job)
          .set({
            applicationLink: jobInfo.applicationLink,
            description: jobInfo.description,
            role: jobInfo.role,
            expiry: new Date(jobInfo.expiry),
            mode: jobInfo.jobMode,
            studentDemographic: jobInfo.studentDemographic,
            jobType: jobInfo.jobType,
            workingRights: jobInfo.workingRights,
            wamRequirements: jobInfo.wamRequirements,
            additionalInfo: jobInfo.additionalInfo,
            isPaid: jobInfo.isPaid,
          })
          .where('Job.id = :id', { id: jobInfo.id })
          .execute();

        // verify job has been updated
        const newJob = await AppDataSource.getRepository(Job)
          .createQueryBuilder('job')
          .where('job.id = :id', { id: jobInfo.id })
          .getOne();

        if (!CompanyFunctions.isJobUpdated(newJob, jobInfo)) {
          return {
            status: 403,
            msg: {
              token: req.newJbToken,
            },
          } as IResponseWithStatus;
        }

        Logger.Info(`COMPANY=${companyId} sucessfully edited JOB=${jobInfo.id}`);

        return {
          status: 200,
          msg: undefined,
        } as IResponseWithStatus;
      },
      () => ({
        status: 400,
        msg: undefined,
      } as IResponseWithStatus),
      next,
    );
  }

  public static async GetAllJobsFromCompany(
    this: void,
    req: CompanyGetJobsRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(`COMPANY_ACCOUNT=${req.companyAccountID} attempting to list all of its jobs`);
        const companyJobs = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .leftJoinAndSelect('Job.company', 'company')
            .where('company.id = :id', { id: parseInt(req.companyAccountID, 10) })
            .andWhere('Job.deleted = :deleted', { deleted: false })
            .andWhere('Job.expiry > :expiry', { expiry: new Date() })
            .orderBy('Job.createdAt', 'DESC')
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
            .getMany(),
          `Failed to find jobs for COMPANY=${req.companyAccountID}`,
        );

        const fixedCompanyJobs = companyJobs.map((job) => {
          let jobStatus = 'Unknown';
          if (job.approved && !job.hidden) {
            jobStatus = 'Approved';
          } else if (!job.approved && job.hidden) {
            jobStatus = 'Rejected';
          } else if (!job.approved && !job.hidden) {
            jobStatus = 'Pending';
          }
          return {
            id: job.id,
            role: job.role,
            description: job.description,
            applicationLink: job.applicationLink,
            status: jobStatus,
            additionalInfo: job.additionalInfo,
            expiry: job.expiry,
            mode: job.mode,
            studentDemographic: job.studentDemographic,
            jobType: job.jobType,
            workingRights: job.workingRights,
            wamRequirements: job.wamRequirements,
            isPaid: job.isPaid,
          };
        });

        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            companyJobs: fixedCompanyJobs,
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

  public static async MarkJobPostRequestAsDeleted(
    this: void,
    req: DeleteJobRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(
          `COMPANY=${req.companyAccountID} attempting to mark JOB=${req.params.jobID} as deleted`,
        );
        const jobToDelete = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .leftJoinAndSelect('Job.company', 'company')
            .where('company.id = :id', { id: parseInt(req.companyAccountID, 10) })
            .andWhere('Job.id = :jobID', { jobID: req.params.jobID })
            .andWhere('Job.deleted = :deleted', { deleted: false })
            .getOne(),
          `Failed to find JOB=${req.params.jobID} for COMPANY_ACCOUNT=${req.companyAccountID}`,
        );

        // found a valid job that can be deleted
        await AppDataSource.createQueryBuilder()
          .update(Job)
          .set({ deleted: true })
          .where('id = :id', { id: jobToDelete.id })
          .execute();

        Logger.Info(`COMPANY=${req.companyAccountID} marked JOB=${req.params.jobID} as deleted`);

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

  public static async SendResetPasswordEmail(
    this: void,
    req: CompanyResetPasswordEmailRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        // check for required params
        const receipientEmail = req.body.username;
        Helpers.requireParameters(receipientEmail);
        Logger.Info(
          `Attempting to send an email to company with USERNAME=${receipientEmail} to reset their password`,
        );
        // check if company with provided username exists
        const companyAccountUsernameSearchResult = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(CompanyAccount)
            .createQueryBuilder('company_account')
            .where('company_account.username = :username', { username: receipientEmail })
            .getOne(),
          `Failed to find company account with USERNAME=${receipientEmail}`,
        );
        // create new token
        const token = JWT.create({
          id: companyAccountUsernameSearchResult.id,
          type: AccountType.Company,
          lastRequestTimestamp: Date.now(),
          ipAddress: req.ip,
        });
        await AppDataSource.createQueryBuilder()
          .update(CompanyAccount)
          .set({ latestValidResetToken: token })
          .where('id = :id', { id: companyAccountUsernameSearchResult.id })
          .execute();

        await MailFunctions.AddMailToQueue(
          receipientEmail,
          'JobsBoard Password Reset Request',
          `
        We received a request to reset the password for your JobsBoard account.
        <br>
        To continue, please click the following <a href="https://jobsboard.csesoc.unsw.edu.au/company/reset/${token}">link</a>.
        <br>
        <p>If you did not request a password reset for your account, simply ignore this message.</p>
        <p>Best regards,</p>
        <p>The JobsBoard Team</p>
        `,
        );
        return {
          status: 200,
          msg: undefined,
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

  public static async GetPasswordResetToken(
    this: void,
    req: CompanyGetResetTokenRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        const { username } = req.params;
        Helpers.requireParameters(username);

        Logger.Info(`Retrieving paswsword reset token for COMPANY=${username} `);

        const resetToken = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(CompanyAccount)
            .createQueryBuilder('company_account')
            .select(['company_account.latestValidResetToken'])
            .where('company_account.username = :username', { username })
            .getOne(),
          `Failed to find password reset token for COMPANY=${username}`,
        );

        // check the reset token is not empty
        Helpers.requireParameters(resetToken.latestValidResetToken);

        return {
          status: 200,
          msg: {
            token: resetToken.latestValidResetToken,
          },
        } as IResponseWithStatus;
      },
      () => ({
        status: 400,
        msg: undefined,
      } as IResponseWithStatus),
      next,
    );
  }

  public static async PasswordReset(
    this: void,
    req: CompanyResetPasswordRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        // check if required parameters are supplied
        const msg = {
          newPassword: req.body.newPassword,
        };

        Helpers.requireParameters(msg.newPassword);

        const jwt: IToken = JWT.get(req.get('Authorization'));
        // get the id of the company making this request
        const companyAccount = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(CompanyAccount)
            .createQueryBuilder('company_account')
            .where('company_account.id = :id', { id: jwt.id })
            .getOne(),
          `Failed to find company account with ID=${jwt.id}`,
        );

        Logger.Info(`Attempting to reset password for COMPANY=${companyAccount.id}`);
        // update the company's password with the new password
        await AppDataSource.createQueryBuilder()
          .update(CompanyAccount)
          .set({ hash: Secrets.hash(msg.newPassword) })
          .where('id = :id', { id: companyAccount.id })
          .execute();

        Logger.Info(`Password for COMPANY=${companyAccount.id} updated`);

        await AppDataSource.createQueryBuilder()
          .update(CompanyAccount)
          .set({ latestValidToken: 'no token set' })
          .where('id = :id', { id: companyAccount.id })
          .execute();

        return {
          status: 200,
          msg: undefined,
        } as IResponseWithStatus;
      },
      () => ({
        status: 400,
        msg: undefined,
      } as IResponseWithStatus),
      next,
    );
  }

  public static async UploadLogo(req: CompanyUploadLogoRequest, res: Response, next: NextFunction) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        const { companyAccountID } = req;

        Helpers.requireParameters(companyAccountID);
        Helpers.requireParameters(req.body.logo);

        Logger.Info(`COMPANY=${companyAccountID} attempting to upload a logo`);

        await AppDataSource.createQueryBuilder()
          .update(Company)
          .set({
            logo: Buffer.from(req.body.logo, 'utf8'),
          })
          .where('id = :id', { id: companyAccountID })
          .execute();

        Logger.Info(`COMPANY=${companyAccountID} successfully uploaded a logo`);

        return {
          status: 200,
          msg: undefined,
        } as IResponseWithStatus;
      },
      () => ({
        status: 400,
        msg: undefined,
      } as IResponseWithStatus),
      next,
    );
  }

  public static async GetCompanyLogoStatus(
    this: void,
    req: CheckCompanyLogoRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        const companyLogo = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(Company)
            .createQueryBuilder()
            .select(['Company.logo'])
            .where('Company.id = :id', { id: parseInt(req.companyAccountID, 10) })
            .getOne(),
          `Failed to find logo for COMPANY=${req.companyAccountID}.`,
        );

        if (!companyLogo) {
          return {
            status: 404,
            msg: undefined,
          } as IResponseWithStatus;
        }

        return {
          status: 200,
          msg: undefined,
        } as IResponseWithStatus;
      },
      () => ({
        status: 400,
        msg: undefined,
      } as IResponseWithStatus),
      next,
    );
  }

  public static async UpdateCompanyDetails(
    this: void,
    req: UpdateCompanyDetailsRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        const { companyAccountID } = req;

        // check if required parameters are supplied
        Helpers.requireParameters(companyAccountID);
        Helpers.requireParameters(req.body.name);
        Helpers.requireParameters(req.body.location);
        Helpers.requireParameters(req.body.description);
        Helpers.requireParameters(req.body.logo);

        // ? not sure if the sponsor status can be directly changed by the company itself
        // Helpers.requireParameters(req.body.sponsor);

        Logger.Info(`COMPANY=${companyAccountID} attempting to update its details`);

        await AppDataSource.createQueryBuilder()
          .update(Company)
          .set({
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            logo: Buffer.from(req.body.logo, 'utf8'),
          })
          .where('id = :id', { id: companyAccountID })
          .execute();

        Logger.Info(`COMPANY=${companyAccountID} successfully updated it's details`);

        return {
          status: 200,
          msg: undefined,
        } as IResponseWithStatus;
      },
      () => ({
        status: 400,
        msg: undefined,
      } as IResponseWithStatus),
      next,
    );
  }
}