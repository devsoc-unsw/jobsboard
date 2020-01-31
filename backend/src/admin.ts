import { Request, Response } from "express";
import {
  Connection,
  getConnection,
  getRepository,
} from "typeorm";
import { Job } from "./entity/job";
import { Company } from "./entity/company";
import { CompanyAccount } from "./entity/company_account";
import Helpers from "./helpers";
import MailFunctions from "./mail";
import Logger from "./logging";

export default class AdminFunctions {
  public static async ApproveJobRequest(req: Request, res: Response) {
    try {
      const jobID: string = req.params.jobID;
      Helpers.requireParameters(jobID);

      const jobQueryResult = await getRepository(Job)
      .createQueryBuilder()
      .where("job.approved = :approved", { approved: false })
      .andWhere("job.hidden = :hidden", { hidden: false })
      .andWhere("job.id = :id", { id: parseInt(jobID, 10) })
      .getOne();

      if (jobQueryResult === undefined) {
        throw new Error(`Couldn't find job with ID: ${jobID}`);
      }

      jobQueryResult.company = await getConnection()
      .createQueryBuilder()
      .relation(Job, "company")
      .of(jobQueryResult)
      .loadOne();

      if (jobQueryResult.company === undefined) {
        throw new Error(`Error with finding company record for job ID: ${jobID}`);
      }

      jobQueryResult.company.companyAccount = await getConnection()
      .createQueryBuilder()
      .relation(Company, "companyAccount")
      .of(jobQueryResult.company)
      .loadOne();

      if (jobQueryResult.company.companyAccount === undefined) {
        throw new Error(`Error with finding company account record for job ID: ${jobID}`);
      }

      const conn: Connection = getConnection();

      await conn.createQueryBuilder()
      .update(Job)
      .set({ approved: true })
      .where("id = :id", { id: jobQueryResult.id })
      .execute();

      MailFunctions.AddMailToQueue(
        jobQueryResult.company.companyAccount.username,
        "CSESoc Jobs Board - Job Post request approved",
        `
        Congratulations! You job post request titled "${jobQueryResult.role}" has been approved. UNSW CSESoc students are now able to view the posting.
          <br>
        Best regards,
        CSESoc Jobs Board Administrator
        `,
      );
      res.sendStatus(200);
    } catch (error) {
      Logger.Error(error);
      res.sendStatus(400);
    }
  }

  public static async RejectJobRequest(req: Request, res: Response) {
    try {
      const jobID: string = req.params.jobID;
      Helpers.requireParameters(jobID);

      const conn: Connection = getConnection();

      const jobQueryResult = await getRepository(Job)
      .createQueryBuilder()
      .where("job.approved = :approved", { approved: false })
      .andWhere("job.hidden = :hidden", { hidden: false })
      .andWhere("job.id = :id", { id: parseInt(jobID, 10) })
      .getOne();

      if (jobQueryResult === undefined) {
        throw new Error(`Couldn't find job with ID: ${jobID}`);
      }

      jobQueryResult.company = await getConnection()
      .createQueryBuilder()
      .relation(Job, "company")
      .of(jobQueryResult)
      .loadOne();

      if (jobQueryResult.company === undefined) {
        throw new Error(`Error with finding company record for job ID: ${jobID}`);
      }

      jobQueryResult.company.companyAccount = await getConnection()
      .createQueryBuilder()
      .relation(Company, "companyAccount")
      .of(jobQueryResult.company)
      .loadOne();

      if (jobQueryResult.company.companyAccount === undefined) {
        throw new Error(`Error with finding company account record for job ID: ${jobID}`);
      }

      await conn.createQueryBuilder()
      .update(Job)
      .set({ hidden: true })
      .where("id = :id", { id: jobQueryResult.id })
      .execute();

      MailFunctions.AddMailToQueue(
        jobQueryResult.company.companyAccount.username,
        "CSESoc Jobs Board - Job Post request rejected",
        `
You job post request titled "${jobQueryResult.role}" has been rejected as it does not follow our <a href="">job post guidelines</a>. You are more than welcome to re-submit a revised version of the job application that better follows the aforementioned guidelines.
          <br>
        Best regards,
        CSESoc Jobs Board Administrator
        `,
      );
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async GetPendingJobs(_: Request, res: Response) {
    try {
      const pendingJobQuery = await getRepository(Job)
        .createQueryBuilder()
        .where("job.approved = :approved", { approved: false })
        .andWhere("job.hidden = :hidden", { hidden: false })
        .getMany();

      const conn: Connection = getConnection();
      await pendingJobQuery.map( async (pendingJob) => {
        pendingJob.company = await conn
        .createQueryBuilder()
        .relation(Job, "company")
        .of(pendingJobQuery)
        .loadOne();
      });

      Logger.Info(JSON.stringify(pendingJobQuery));

      res.send(pendingJobQuery);
    } catch (error) {
      res.sendStatus(400);
    }
  }
}
