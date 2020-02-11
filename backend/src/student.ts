import { Request, Response, NextFunction } from "express";
import {
  getRepository
} from "typeorm";
import { Job } from "./entity/job";
import Helpers from "./helpers";

export default class StudentFunctions {
  public static async GetAllActiveJobs(_: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await getRepository(Job)
        .createQueryBuilder()
        .select(["Company.name", "Company.location", "Company.description", "Job.id", "Job.role", "Job.description", "Job.applicationLink"])
        .leftJoinAndSelect("Job.company", "company")
        .where("Job.approved = :approved", { approved: true })
        .andWhere("Job.hidden = :hidden", { hidden: false })
        .getMany();

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
    next();
  }

  public static async GetJob(req: Request, res: Response, next: NextFunction) {
    try {
      Helpers.requireParameters(req.params.jobID);
      const jobInfo = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Job)
          .createQueryBuilder()
          .select(["Company.name", "Company.location", "Company.description", "Job.id", "Job.role", "Job.description", "Job.applicationLink"])
          .leftJoinAndSelect("Job.company", "company")
          .where("Job.approved = :approved", { approved: true })
          .andWhere("Job.id = :id", { id: parseInt(req.params.jobID, 10) })
          .getOne();
      }, `Couldn't find job with ID: ${req.params.jobID}`);

      res.send(jobInfo);
    } catch (error) {
      res.sendStatus(400);
    }
    next();
  }
}
