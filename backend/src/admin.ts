import { 
  // Request, 
  Response, 
  NextFunction 
} from "express";
import {
  Connection,
  getConnection,
  getRepository,
} from "typeorm";
import { Job } from "./entity/job";
import { Company } from "./entity/company";
import { CompanyAccount } from "./entity/company_account";
import Helpers, { IResponseWithStatus } from "./helpers";
import MailFunctions from "./mail";
import Logger from "./logging";

export default class AdminFunctions {
  public static async ApproveJobRequest(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      Logger.Info(`Admin ID=${req.adminID} attempting to approve JOB=${req.params.jobID}`);
      Helpers.requireParameters(req.params.jobID);
      const jobID: number = Number(req.params.jobID);
      if (isNaN(jobID)) {
        Logger.Info(`Rejected jobID ${jobID} as it is not a numeric value`);
        return {
          status: 400,
          msg: undefined,
        } as IResponseWithStatus;
      }

      const jobToApprove = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Job)
          .createQueryBuilder()
          .where("Job.approved = :approved", { approved: false })
          .andWhere("Job.hidden = :hidden", { hidden: false })
          .andWhere("Job.id = :id", { id: jobID })
          .getOne();
      }, `Failed to find job ID=${jobID}`);

      jobToApprove.company = await Helpers.doSuccessfullyOrFail(async () => {
        return await getConnection()
          .createQueryBuilder()
          .relation(Job, "company")
          .of(jobToApprove)
          .loadOne();
      }, `Failed to find company record owning JOB=${jobID}`);

      jobToApprove.company.companyAccount = await Helpers.doSuccessfullyOrFail(async () => {
        return jobToApprove.company.companyAccount = await getConnection()
          .createQueryBuilder()
          .relation(Company, "companyAccount")
          .of(jobToApprove.company)
          .loadOne();
      }, `Failed to find company account owning JOB=${jobID}`);

      const conn: Connection = getConnection();

      await conn.createQueryBuilder()
        .update(Job)
        .set({ approved: true })
        .where("id = :id", { id: jobToApprove.id })
        .execute();

      MailFunctions.AddMailToQueue(
        jobToApprove.company.companyAccount.username,
        "CSESoc Jobs Board - Job Post request approved",
        `
        Congratulations! You job post request titled "${jobToApprove.role}" has been approved. UNSW CSESoc students are now able to view the posting.
          <br>
        <p>Best regards,</p>
        <p>CSESoc Jobs Board Administrator</p>
        `,
      );
      Logger.Info(`Admin ID=${req.adminID} approved JOB=${req.params.jobID}`);
      return {
        status: 200,
        msg: {
          token: req.newJbToken
        } 
      } as IResponseWithStatus;
    }, () => {
      return {
        status: 400,
        msg: {
          token: req.newJbToken
        } 
      } as IResponseWithStatus;
    }, next);
  }

  public static async RejectJobRequest(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      Logger.Info(`Admin ID=${req.adminID} attempting to reject JOB=${req.params.jobID}`);
      Helpers.requireParameters(req.params.jobID);
      const jobID: number = Number(req.params.jobID);
      if (isNaN(jobID)) {
        return {
          status: 400,
          msg: undefined,
        } as IResponseWithStatus;
      }

      const conn: Connection = getConnection();
      const jobToReject = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Job)
          .createQueryBuilder()
          .where("Job.approved = :approved", { approved: false })
          .andWhere("Job.hidden = :hidden", { hidden: false })
          .andWhere("Job.id = :id", { id: jobID })
          .getOne();
      }, `Failed to find job ID=${jobID}`);

      jobToReject.company = await Helpers.doSuccessfullyOrFail(async () => {
        return await getConnection()
          .createQueryBuilder()
          .relation(Job, "company")
          .of(jobToReject)
          .loadOne();
      }, `Failed to find company record owning JOB=${jobID}`);

      jobToReject.company.companyAccount = await Helpers.doSuccessfullyOrFail(async () => {
        return await getConnection()
          .createQueryBuilder()
          .relation(Company, "companyAccount")
          .of(jobToReject.company)
          .loadOne();
      }, `Failed to find company account owning JOB=${jobID}`);

      await conn.createQueryBuilder()
        .update(Job)
        .set({ hidden: true })
        .where("id = :id", { id: jobToReject.id })
        .execute();

      MailFunctions.AddMailToQueue(
        jobToReject.company.companyAccount.username,
        "CSESoc Jobs Board - Job Post request rejected",
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
          token: req.newJbToken
        } 
      } as IResponseWithStatus;
    }, () => {
      return {
        status: 400,
        msg: {
          token: req.newJbToken
        } 
      } as IResponseWithStatus;
    }, next);
  }

  public static async GetPendingJobs(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      Logger.Info(`ADMIN=${req.adminID} attempting to query pending jobs`);
      let pendingJobs = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Job)
          .createQueryBuilder()
          .select(["Job.id", "Job.role", "Job.description", "Job.applicationLink"])
          .where("Job.approved = :approved", { approved: false })
          .andWhere("Job.hidden = :hidden", { hidden: false })
          .getMany();
      }, `Couldn't find any pending job requests.`);

      for (let jobIndex = 0; jobIndex < pendingJobs.length; jobIndex++) {
        pendingJobs[jobIndex].company = await getConnection().createQueryBuilder()
          .relation(Job, "company")
          .of(pendingJobs[jobIndex])
          .loadOne();
      }
      return {
        status: 200, 
        msg: {
          token: req.newJbToken,
          pendingJobs: pendingJobs 
        }
      } as IResponseWithStatus;
    }, () => {
      return {
        status: 400,
        msg: {
          token: req.newJbToken,
        }
      } as IResponseWithStatus;
    }, next);
  }

  public static async GetPendingCompanyVerifications(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      Logger.Info(`ADMIN=${req.adminID} attempting to query pending companies`);
      let pendingCompanyVerifications = await Helpers.doSuccessfullyOrFail(async () => {
        const pendingCompanyAccounts = await getRepository(CompanyAccount)
          .createQueryBuilder()
          .select("CompanyAccount.id")
          .where("CompanyAccount.verified = :verified", { verified: false })
          .getMany();
        for (let companyAccountIndex = 0; companyAccountIndex < pendingCompanyAccounts.length; companyAccountIndex++) {
          pendingCompanyAccounts[companyAccountIndex].company = await getConnection()
            .createQueryBuilder()
            .relation(CompanyAccount, "company")
            .of(pendingCompanyAccounts[companyAccountIndex])
            .loadOne();
        }
        return pendingCompanyAccounts;
      }, `Couldn't find any pending company verifications.`);
      return {
        status: 200, 
        msg: {
          token: req.newJbToken,
          pendingCompanyVerifications: pendingCompanyVerifications 
        }
      } as IResponseWithStatus;
    }, () => {
      return {
        status: 400,
        msg: {
          token: req.newJbToken
        }
      } as IResponseWithStatus;
    }, next);
  }

  public static async VerifyCompanyAccount(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      Logger.Info(`Admin ID=${req.adminID} attempting to verify COMPANY=${req.params.companyAccountID}`);
      let pendingCompany = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(CompanyAccount)
          .createQueryBuilder()
          .where("CompanyAccount.id = :id", { id: req.params.companyAccountID })
          .andWhere("CompanyAccount.verified = :verified", { verified: false })
          .getOne();
      }, `Couldn't find any pending company verifications for COMPANY_ACCOUNT=${req.params.companyAccountID}.`);

      await getConnection().createQueryBuilder()
        .update(CompanyAccount)
        .set({ verified: true })
        .where("id = :id", { id: pendingCompany.id })
        .execute();

      // send an email confirming that the account has been verified
      MailFunctions.AddMailToQueue(
        pendingCompany.username,
        "CSESoc Jobs Board - Success! Your account has been verified",
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
        }
      } as IResponseWithStatus;
    }, () => {
      return {
        status: 400,
        msg: {
          token: req.newJbToken,
        }
      } as IResponseWithStatus;
    }, next);
  }

  public static async ListAllCompaniesAsAdmin(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      Logger.Info(`Admin ID=${req.adminID} attempting to query all companies`);
      let companyAccounts = await Helpers.doSuccessfullyOrFail(async () => {
        const companyAccounts = await getRepository(CompanyAccount)
          .createQueryBuilder()
          .where("CompanyAccount.verified = :verified", { verified: false })
          .getMany();
        for (let companyAccountIndex = 0; companyAccountIndex < companyAccounts.length; companyAccountIndex++) {
          companyAccounts[companyAccountIndex].company = await getConnection()
            .createQueryBuilder()
            .relation(CompanyAccount, "company")
            .of(companyAccounts[companyAccountIndex])
            .loadOne();
        }
        return companyAccounts;
      }, `Couldn't get all verified company objects as Admin ID=${req.adminID}`);


      const fixedCompanies = companyAccounts.map((companyAccount: CompanyAccount) => {
        return {
          id: companyAccount.company.id,
          name: companyAccount.company.name,
          location: companyAccount.company.location
        };
      });

      return {
        status: 200, 
        msg: {
          companies: fixedCompanies,
        }
      } as IResponseWithStatus;
    }, () => {
      return {
        status: 400,
        msg: {
          token: req.newJbToken,
        }
      } as IResponseWithStatus;
    }, next);
  }

  public static async CreateJobOnBehalfOfExistingCompany(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      Logger.Info(`Admin ID=${req.adminID} attempting to find company ID=${req.params.companyID}`);
      let company = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Company)
          .createQueryBuilder()
          .where("Company.id = :id", { id: req.params.companyID })
      }, `Couldn't get request company object ID=${req.params.companyID} as Admin ID=${req.adminID}`);

      // get it's associated company account to verify
      company.companyAccount = await getConnection()
        .createQueryBuilder()
        .relation(Company, "companyAccount")
        .of(company)
        .loadOne();

      // verify whether the associated company account is verified
      if (!company.companyAccount.verified) {
        throw new Error(`Admin ID=${req.adminID} attempted to create a job post for company ID=${req.params.companyID} however it was not a verified company`);
      }

      // create the job now
      // ensure required parameters are present
      const msg = {
        applicationLink: req.body.applicationLink.trim(),
        description: req.body.description.trim(),
        role: req.body.role.trim(),
        expiry: req.body.expiry.trim(),
      };
      Helpers.requireParameters(msg.role);
      Helpers.requireParameters(msg.description);
      Helpers.requireParameters(msg.applicationLink);
      Helpers.requireParameters(msg.expiry);
      Helpers.isDateInTheFuture(msg.expiry);
      Helpers.validApplicationLink(msg.applicationLink);
      Logger.Info(`Attempting to create job for COMPANY=${req.companyAccountID} with ROLE=${msg.role} DESCRIPTION=${msg.description} applicationLink=${msg.applicationLink} as adminID=${req.adminID}`);
      const conn: Connection = getConnection();
      const newJob = new Job();
      newJob.role = msg.role;
      newJob.description = msg.description;
      newJob.applicationLink = msg.applicationLink;
      newJob.expiry = msg.expiry;

      company.jobs.push(newJob);

      await conn.manager.save(company);

      const newJobID: number = company.jobs[company.jobs.length - 1].id;
      Logger.Info(`Created JOB=${newJobID} for COMPANY_ACCOUNT=${req.companyAccountID} as adminID=${req.adminID}`);

      // check to see if that job is queryable
      const newJobQueryVerification = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Job)
          .createQueryBuilder()
          .where("Job.id = :id", { id: newJobID })
          .getOne();
      }, `Failed to fetch the newly created JOB=${newJobID}`);

      return {
        status: 200, 
        msg: {
          token: req.newJbToken,
        }
      } as IResponseWithStatus;
    }, () => {
      return {
        status: 400,
        msg: {
          token: req.newJbToken,
        }
      } as IResponseWithStatus;
    }, next);
  }
}
