import { Request, Response } from "express";
import {
  Connection,
  getConnection,
} from "typeorm";
import Auth, { AccountType, IToken } from "./auth";
import { Job } from "./entity/job";
import Helpers from "./helpers";
import JWT from "./jwt";

export default class StudentFunctions {
  public static async GetAllActiveJobs(_: Request, res: Response) {
    try {
      const conn: Connection = await getConnection();
      const jobs = await conn.getRepository(Job).find({
        relations: ["company"],
      });
      res.send(jobs);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async GetJob(req: Request, res: Response) {
    try {
      Helpers.requireParameters(req.params.jobID);
      const conn: Connection = await getConnection();
      const jobInfo = await conn.getRepository(Job).findOneOrFail({
        relations: ["company"],
        where: {
          id: parseInt(req.params.jobID, 10),
        },
      });
      res.send(jobInfo);
    } catch (error) {
      res.sendStatus(400);
    }
  }

}
