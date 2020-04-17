import { Request, Response, NextFunction } from "express";
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
      const jobID: string = req.params.jobID;
      Helpers.requireParameters(jobID);

      const jobToApprove = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Job)
          .createQueryBuilder()
          .where("Job.approved = :approved", { approved: false })
          .andWhere("Job.hidden = :hidden", { hidden: false })
          .andWhere("Job.id = :id", { id: parseInt(jobID, 10) })
          .getOne();
      }, `Couldn't find job with ID: ${jobID}`);

      jobToApprove.company = await Helpers.doSuccessfullyOrFail(async () => {
        return await getConnection()
          .createQueryBuilder()
          .relation(Job, "company")
          .of(jobToApprove)
          .loadOne();
      }, `Error with finding company record for job ID: ${jobID}`);

      jobToApprove.company.companyAccount = await Helpers.doSuccessfullyOrFail(async () => {
        return jobToApprove.company.companyAccount = await getConnection()
          .createQueryBuilder()
          .relation(Company, "companyAccount")
          .of(jobToApprove.company)
          .loadOne();
      }, `Error with finding company account record for job ID: ${jobID}`);

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
        Best regards,
        CSESoc Jobs Board Administrator
        `,
      );
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
      const jobID: string = req.params.jobID;
      Helpers.requireParameters(jobID);

      const conn: Connection = getConnection();
      const jobToReject = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Job)
          .createQueryBuilder()
          .where("job.approved = :approved", { approved: false })
          .andWhere("job.hidden = :hidden", { hidden: false })
          .andWhere("job.id = :id", { id: parseInt(jobID, 10) })
          .getOne();
      }, `Couldn't find job with ID: ${jobID}`);

      jobToReject.company = await Helpers.doSuccessfullyOrFail(async () => {
        return await getConnection()
          .createQueryBuilder()
          .relation(Job, "company")
          .of(jobToReject)
          .loadOne();
      }, `Error with finding company record for job ID: ${jobID}`);

      jobToReject.company.companyAccount = await Helpers.doSuccessfullyOrFail(async () => {
        return await getConnection()
          .createQueryBuilder()
          .relation(Company, "companyAccount")
          .of(jobToReject.company)
          .loadOne();
      }, `Error with finding company account record for job ID: ${jobID}`);

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
        Best regards,
        CSESoc Jobs Board Administrator
        `,
      );
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
      let pendingJobs = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Job)
          .createQueryBuilder()
          .select(["Job.id", "Job.role", "Job.description", "Job.applicationLink"])
          .where("job.approved = :approved", { approved: false })
          .andWhere("job.hidden = :hidden", { hidden: false })
          .getMany();
      }, `Couldn't find any pending job requests`);

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
      }, `Couldn't find any pending company verifications`);
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
      let pendingCompany = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(CompanyAccount)
          .createQueryBuilder()
          .where("CompanyAccount.id = :id", { id: req.params.companyAccountID })
          .andWhere("CompanyAccount.verified = :verified", { verified: false })
          .getOne();
      }, `Couldn't find any pending company verifications`);

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

        Congratulations! Your company account for ${pendingCompany.name} has been successful. You are now able to post job requests on the CSESoc Jobs Board. The process for doing so is as follows:
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
        Best regards,
        CSESoc Jobs Board Administrator
        `,
      );
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
