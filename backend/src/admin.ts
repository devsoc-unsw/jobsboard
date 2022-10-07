import {
  // Request,
  Response,
  NextFunction,
} from 'express';

import { AppDataSource } from './index';
import { Job } from './entity/job';
import { Company } from './entity/company';
import { CompanyAccount } from './entity/company_account';
import { Statistics } from './entity/statistics';
import Helpers, { IResponseWithStatus } from './helpers';
import MailFunctions from './mail';
import Logger from './logging';
import { Brackets } from 'typeorm';

export default class AdminFunctions {
  public static async ApproveJobRequest(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(`Admin ID=${req.adminID} attempting to approve JOB=${req.params.jobID}`);
        Helpers.requireParameters(req.params.jobID);
        const jobID = Number(req.params.jobID);
        if (isNaN(jobID)) {
          Logger.Info(`Rejected jobID ${jobID} as it is not a numeric value`);
          return {
            status: 400,
            msg: undefined,
          } as IResponseWithStatus;
        }

        const jobToApprove = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .where('Job.approved = :approved', { approved: false })
            .andWhere('Job.hidden = :hidden', { hidden: false })
            .andWhere('Job.id = :id', { id: jobID })
            .getOne();
        }, `Failed to find job ID=${jobID}`);

        jobToApprove.company = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.createQueryBuilder().relation(Job, 'company').of(jobToApprove).loadOne();
        }, `Failed to find company record owning JOB=${jobID}`);

        jobToApprove.company.companyAccount = await Helpers.doSuccessfullyOrFail(async () => {
          return (jobToApprove.company.companyAccount = await AppDataSource.createQueryBuilder()
            .relation(Company, 'companyAccount')
            .of(jobToApprove.company)
            .loadOne());
        }, `Failed to find company account owning JOB=${jobID}`);

        await AppDataSource.createQueryBuilder()
          .update(Job)
          .set({ approved: true })
          .where('id = :id', { id: jobToApprove.id })
          .execute();

        // increment number of jobs approved for that year
        const jobCreatedYear = jobToApprove.createdAt.getFullYear();
        const numApprovedJobs = await Helpers.doSuccessfullyOrFail(async () => {
          return AppDataSource.getRepository(Statistics)
            .createQueryBuilder('s')
            .select(['s.numJobPosts'])
            .where('s.year = :year', { year: jobCreatedYear })
            .getOne();
        }, `Failed to retrive the number of approved job posts for YEAR=${jobCreatedYear}`);

        await AppDataSource.createQueryBuilder()
          .update(Statistics)
          .set({ numJobPosts: numApprovedJobs + 1 })
          .where('year = :year', { year: jobCreatedYear })
          .execute();

        MailFunctions.AddMailToQueue(
          jobToApprove.company.companyAccount.username,
          'CSESoc Jobs Board - Job Post request approved',
          `
        Congratulations! Your job post request titled "${jobToApprove.role}" has been approved. UNSW CSESoc students are now able to view the posting.
          <br>
        <p>Best regards,</p>
        <p>CSESoc Jobs Board Administrator</p>
        `,
        );
        Logger.Info(`Admin ID=${req.adminID} approved JOB=${req.params.jobID}`);
        return {
          status: 200,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      next,
    );
  }

  public static async RejectJobRequest(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(`Admin ID=${req.adminID} attempting to reject JOB=${req.params.jobID}`);
        Helpers.requireParameters(req.params.jobID);
        const jobID = Number(req.params.jobID);
        if (isNaN(jobID)) {
          return {
            status: 400,
            msg: undefined,
          } as IResponseWithStatus;
        }

        const jobToReject = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .where('Job.approved = :approved', { approved: false })
            .andWhere('Job.hidden = :hidden', { hidden: false })
            .andWhere('Job.id = :id', { id: jobID })
            .getOne();
        }, `Failed to find job ID=${jobID}`);

        jobToReject.company = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.createQueryBuilder().relation(Job, 'company').of(jobToReject).loadOne();
        }, `Failed to find company record owning JOB=${jobID}`);

        jobToReject.company.companyAccount = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.createQueryBuilder()
            .relation(Company, 'companyAccount')
            .of(jobToReject.company)
            .loadOne();
        }, `Failed to find company account owning JOB=${jobID}`);

        await AppDataSource.createQueryBuilder()
          .update(Job)
          .set({ hidden: true })
          .where('id = :id', { id: jobToReject.id })
          .execute();

        MailFunctions.AddMailToQueue(
          jobToReject.company.companyAccount.username,
          'CSESoc Jobs Board - Job Post request rejected',
          `
You job post request titled "${jobToReject.role}" has been rejected as it does not follow our <a href="">job post guidelines</a>. You are more than welcome to re-submit a revised version of the job application that better follows the aforementioned guidelines.
          <br>
        <p>Best regards,</p>
        <p>CSESoc Jobs Board Administrator</p>
        `,
        );
        Logger.Info(`Admin ID=${req.adminID} attempting to reject JOB=${req.params.jobID}`);
        return {
          status: 200,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      next,
    );
  }

  public static async GetPendingJobs(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(`ADMIN=${req.adminID} attempting to query pending jobs`);
        const pendingJobs = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .select(['Job.id', 'Job.role', 'Job.description', 'Job.applicationLink'])
            .where('Job.approved = :approved', { approved: false })
            .andWhere('Job.hidden = :hidden', { hidden: false })
            .getMany();
        }, `Couldn't find any pending job requests.`);

        for (let jobIndex = 0; jobIndex < pendingJobs.length; jobIndex++) {
          pendingJobs[jobIndex].company = await AppDataSource.createQueryBuilder()
            .relation(Job, 'company')
            .of(pendingJobs[jobIndex])
            .loadOne();
        }
        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            pendingJobs: pendingJobs,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      next,
    );
  }

  public static async GetPendingCompanyVerifications(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(`ADMIN=${req.adminID} attempting to query pending companies`);
        const pendingCompanyVerifications = await Helpers.doSuccessfullyOrFail(async () => {
          const pendingCompanyAccounts = await AppDataSource.getRepository(CompanyAccount)
            .createQueryBuilder()
            .select('CompanyAccount.id')
            .where('CompanyAccount.verified = :verified', { verified: false })
            .getMany();
          for (
            let companyAccountIndex = 0;
            companyAccountIndex < pendingCompanyAccounts.length;
            companyAccountIndex++
          ) {
            pendingCompanyAccounts[companyAccountIndex].company = await AppDataSource.createQueryBuilder()
              .relation(CompanyAccount, 'company')
              .of(pendingCompanyAccounts[companyAccountIndex])
              .loadOne();
          }
          return pendingCompanyAccounts;
        }, `Couldn't find any pending company verifications.`);
        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            pendingCompanyVerifications: pendingCompanyVerifications,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      next,
    );
  }

  public static async VerifyCompanyAccount(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(`Admin ID=${req.adminID} attempting to verify COMPANY=${req.params.companyAccountID}`);
        const pendingCompany = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.getRepository(CompanyAccount)
            .createQueryBuilder()
            .where('CompanyAccount.id = :id', { id: req.params.companyAccountID })
            .andWhere('CompanyAccount.verified = :verified', { verified: false })
            .getOne();
        }, `Couldn't find any pending company verifications for COMPANY_ACCOUNT=${req.params.companyAccountID}.`);

        await AppDataSource.createQueryBuilder()
          .update(CompanyAccount)
          .set({ verified: true })
          .where('id = :id', { id: pendingCompany.id })
          .execute();

        // send an email confirming that the account has been verified
        MailFunctions.AddMailToQueue(
          pendingCompany.username,
          'CSESoc Jobs Board - Success! Your account has been verified',
          `

        Congratulations! Your company account creation has been successful. You are now able to post job requests on the CSESoc Jobs Board. The process for doing so is as follows:
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
        <p>CSESoc Jobs Board Administrator</p>
        `,
        );
        Logger.Info(`Admin ID=${req.adminID} verified COMPANY=${req.params.companyAccountID}`);
        return {
          status: 200,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      next,
    );
  }

  public static async ListAllCompaniesAsAdmin(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(`Admin ID=${req.adminID} attempting to query all companies`);
        const companyAccounts = await Helpers.doSuccessfullyOrFail(async () => {
          const companyAccounts = await AppDataSource.getRepository(CompanyAccount)
            .createQueryBuilder()
            .where('CompanyAccount.verified = :verified', { verified: true })
            .getMany();
          for (let companyAccountIndex = 0; companyAccountIndex < companyAccounts.length; companyAccountIndex++) {
            companyAccounts[companyAccountIndex].company = await AppDataSource.createQueryBuilder()
              .relation(CompanyAccount, 'company')
              .of(companyAccounts[companyAccountIndex])
              .loadOne();
          }
          return companyAccounts;
        }, `Couldn't get all verified company objects as Admin ID=${req.adminID}`);

        const fixedCompanies = companyAccounts.map((companyAccount: CompanyAccount) => {
          return {
            id: companyAccount.company.id,
            name: companyAccount.company.name,
            location: companyAccount.company.location,
          };
        });

        return {
          status: 200,
          msg: {
            companies: fixedCompanies,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      next,
    );
  }

  public static async CreateJobOnBehalfOfExistingCompany(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(
      res,
      async () => {
        const companyID = req.params.companyID;
        Logger.Info(`Admin ID=${req.adminID} attempting to find company ID=${companyID}`);
        const company = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.getRepository(Company)
            .createQueryBuilder()
            .where('Company.id = :id', { id: companyID })
            .getOne();
        }, `Couldn't get request company object ID=${companyID} as Admin ID=${req.adminID}`);

        // get it's associated company account to verify
        company.companyAccount = await Helpers.doSuccessfullyOrFail(async () => {
          return AppDataSource.createQueryBuilder().relation(Company, 'companyAccount').of(company).loadOne();
        }, `Could not get the related company account for company ID=${company.id}`);

        company.jobs = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.createQueryBuilder().relation(Company, 'jobs').of(company).loadMany();
        }, `Failed to find jobs for COMPANY_ACCOUNT=${companyID}`);

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

        MailFunctions.AddMailToQueue(
          process.env.MAIL_USERNAME,
          'CSESoc Jobs Board - CSESoc has created a job on your behalf',
          `
        Congratulations! CSESoc has create a job post on your behalf titled "${newJob.role}". UNSW CSESoc students are now able to view the posting.
          <br>
        <p>Best regards,</p>
        <p>CSESoc Jobs Board Administrator</p>
        `,
        );

        company.jobs.push(newJob);

        await AppDataSource.manager.save(company);

        const newJobID: number = company.jobs[company.jobs.length - 1].id;
        Logger.Info(`Created JOB=${newJobID} for COMPANY_ACCOUNT=${companyID} as adminID=${req.adminID}`);

        // check to see if that job is queryable
        const newJobQueryVerification = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .where('Job.id = :id', { id: newJobID })
            .getOne();
        }, `Failed to fetch the newly created JOB=${newJobID}`);

        return {
          status: 200,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      next,
    );
  }

  public static async GetNumVerifiedCompanies(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(`Retrieving the number of verified companies as ADMIN=${req.adminID}`);

        const verifiedCompanies = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.getRepository(CompanyAccount)
            .createQueryBuilder('ca')
            .where('ca.verified = :verified', { verified: true })
            .getMany();
        }, 'Failed to retrive the number of verified comapnies');

        const numVerifiedCompanies = verifiedCompanies.length;

        Logger.Info(`Successfully retrived the number of verified comapanies as ADMIN=${req.adminID}`);

        return {
          status: 200,
          msg: {
            num: numVerifiedCompanies,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
          msg: undefined,
        } as IResponseWithStatus;
      },
      next,
    );
  }

  public static async getNumApprovedJobPosts(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(
          `Retrieving the number of approved jobs in YEAR=${new Date().getFullYear()} as ADMIN=${req.adminID}`,
        );

        const yearToSearch = req.params.year;
        Helpers.requireParameters(yearToSearch);

        const numApprovedJobs = await Helpers.doSuccessfullyOrFail(async () => {
          return AppDataSource.getRepository(Statistics)
            .createQueryBuilder('s')
            .select(['s.numJobPosts'])
            .where('s.year = :year', { year: yearToSearch })
            .getOne();
        }, `Failed to retrieve the number of approved job posts for YEAR=${yearToSearch}`);

        // number of job posts for the provided year hasn't been recorded yet
        if (numApprovedJobs === null) {
          // query all jobs => update statistics table => return value
          const allApprovedJobs = await Helpers.doSuccessfullyOrFail(async () => {
            return AppDataSource.getRepository(Job)
              .createQueryBuilder('j')
              .select(['j.id', 'j.createdAt'])
              .where('j.approved = :approved', { approved: true })
              .andWhere('j.deleted = :deleted', { deleted: false })
              .getMany();
          }, 'Failed to retrive the number of approved posts in the db');

          const allApprovedJobsThatYear = allApprovedJobs.filter(
            (job: any) => job.createdAt.getFullYear() == yearToSearch,
          );
          const numJobsPostsinYear = allApprovedJobsThatYear.length;

          await AppDataSource.createQueryBuilder()
            .insert()
            .into(Statistics)
            .values([{ year: yearToSearch, numJobPosts: numJobsPostsinYear }])
            .execute();

          Logger.Info(
            `Sucessfully retrieved the number of approved jobs in YEAR=${new Date().getFullYear()} as ADMIN=${
              req.adminID
            }`,
          );
          return {
            status: 200,
            msg: {
              numJobPosts: numJobsPostsinYear,
            },
          } as IResponseWithStatus;
        } else {
          Logger.Info(
            `Sucessfully retriveved the number of approved jobs in YEAR=${new Date().getFullYear()} as ADMIN=${
              req.adminID
            }`,
          );
          return {
            status: 200,
            msg: {
              numJobPosts: numApprovedJobs.numJobPosts,
            },
          } as IResponseWithStatus;
        }
      },
      () => {
        return {
          status: 400,
          msg: undefined,
        } as IResponseWithStatus;
      },
      next,
    );
  }

  public static async GetAllHiddenJobs(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(
      res,
      async () => {
        const adminID = req.adminID;
        Helpers.requireParameters(adminID);

        Logger.Info(`ADMIN=${adminID} attempting to list all hidden jobs in the database`);

        const hiddenJobs = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.getRepository(Job)
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
            .getMany();
        }, `Failed to find jobs`);

        // group jobs by company name
        const resMap = new Map();
        hiddenJobs.forEach((job: any) => {
          const key = String(job.company.name);
          if (!resMap.has(key)) {
            resMap.set(key, []);
          }
          resMap.get(key).push(job);
        });

        Logger.Info(`ADMIN=${adminID} successfully to retrieved all the hidden jobs`);

        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            hiddenJobs: resMap,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      next,
    );
  }
}
