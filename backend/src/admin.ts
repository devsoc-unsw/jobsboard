import { Request, Response } from "express";
import {
  Connection,
  getConnection,
  getRepository,
} from "typeorm";
import { Job } from "./entity/job";
import Helpers from "./helpers";
import Logger from "./logging";

export default class AdminFunctions {
  public static async ApproveJobRequest(req: Request, res: Response) {
    try {
      const jobID: string = req.params.jobID;
      Helpers.requireParameters(jobID);
      const jobQueryResult = await getRepository(Job).findOneOrFail({
        where: {
          approved: false,
          hidden: false,
          id: parseInt(jobID, 10),
        },
      });
      const conn: Connection = await getConnection();
      jobQueryResult.approved = true;
      await conn.manager.save(jobQueryResult);
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
      });
      const conn: Connection = await getConnection();
      jobQueryResult.hidden = true;
      await conn.manager.save(jobQueryResult);
      res.sendStatus(200);
    } catch (error) {
      Logger.Error(error);
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
      Logger.Error(error);
      res.sendStatus(400);
    }
  }
}
