import { Request, Response } from "express";
import {
  Connection,
  getConnection,
  getRepository,
} from "typeorm";
import { Job } from "./entity/job";
import { Company } from "./entity/company";
import Helpers from "./helpers";
import MailFunctions from "./mail";
import Logger from "./logging";

export default class AdminFunctions {
  public static async ApproveJobRequest(req: Request, res: Response) {
    try {
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
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async GetPendingJobs(_: Request, res: Response) {
    try {
      const pendingJobs = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Job)
          .createQueryBuilder()
          .where("job.approved = :approved", { approved: false })
          .andWhere("job.hidden = :hidden", { hidden: false })
          .getMany();
      }, `Couldn't find any pending job requests`);

      const conn: Connection = getConnection();
      await pendingJobs.map( async (pendingJob: Job) => {
        pendingJob.company = await conn
          .createQueryBuilder()
          .relation(Job, "company")
          .of(pendingJob)
          .loadOne();
      });

      Logger.Info(JSON.stringify(pendingJobs));

      res.send(pendingJobs);
    } catch (error) {
      res.sendStatus(400);
    }
  }
}
