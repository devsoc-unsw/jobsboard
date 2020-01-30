import { Request, Response } from "express";
import {
  Connection,
  getConnection,
  getRepository,
} from "typeorm";
import { Job } from "./entity/job";
import { CompanyAccount } from "./entity/company_account";
import Helpers from "./helpers";
import MailFunctions from "./mail";
import Logger from "./logging";

export default class AdminFunctions {
  public static async ApproveJobRequest(req: Request, res: Response) {
    try {
      const jobID: string = req.params.jobID;
      Helpers.requireParameters(jobID);
      const jobQueryResult = await getRepository(Job).findOneOrFail({
        relations: ["company"],
        where: {
          approved: false,
          hidden: false,
          id: parseInt(jobID, 10),
        },
      });
      Logger.Error(JSON.stringify(jobQueryResult));
      const companyAccountQuery = await getRepository(CompanyAccount).findOneOrFail({
        relations: ["company"],
        where: {
          company: jobQueryResult.company,
        },
      });
      const conn: Connection = getConnection();
      jobQueryResult.approved = true;
      await conn.manager.save(jobQueryResult);
      MailFunctions.AddMailToQueue(
        companyAccountQuery.username,
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
      const jobQueryResult = await getRepository(Job).findOneOrFail({
        where: {
          approved: false,
          hidden: false,
          id: parseInt(jobID, 10),
        },
        relations: ["company"],
      });
      const companyAccountQuery = await getRepository(CompanyAccount).findOneOrFail({
        where: {
          company: jobQueryResult.company,
        },
        relations: ["company"],
      }).catch((error) => { throw new Error(error); });
      const conn: Connection = getConnection();
      jobQueryResult.hidden = true;
      await conn.manager.save(jobQueryResult);
      MailFunctions.AddMailToQueue(
        companyAccountQuery.username,
        "CSESoc Jobs Board - Job Post request rejected",
        `
  Congratulations! You job post request titled "${jobQueryResult.role}" has been rejected as it does not follow our <a href="">job post guidelines</a>. You are more than welcome to re-submit a revised version of the job application that better follows the aforementioned guidelines.
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
      const pendingJobQuery = await getRepository(Job).find({
        relations: ["company"],
        where: {
          approved: false,
          hidden: false,
        },
      });
      res.send(pendingJobQuery);
    } catch (error) {
      res.sendStatus(400);
    }
  }
}
