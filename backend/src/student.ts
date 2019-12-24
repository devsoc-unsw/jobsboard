import { Request, Response } from "express";
import {
  Connection,
  getConnection,
} from "typeorm";
import { Job } from "./entity/job";
import Helpers from "./helpers";

export default class StudentFunctions {
  public static async GetAllActiveJobs(_: Request, res: Response) {
    try {
      const conn: Connection = await getConnection();
      const jobs = await conn.getRepository(Job).find({
        relations: ["company"],
        where: {
          approved: true,
          hidden: false,
        },
      });

      const fixedJobs = jobs.map((job) => { 
        const newJob: any = {};
        newJob.applicationLink = job.applicationLink;
        newJob.company = job.company;
        newJob.description = job.description;
        newJob.role = job.role;
        newJob.id = job.id;
        return newJob;
      });
      res.send(fixedJobs);
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
        approved: true,
        id: parseInt(req.params.jobID, 10),
      },
    });
    res.send(jobInfo);
  } catch (error) {
    res.sendStatus(400);
  }
}

}
