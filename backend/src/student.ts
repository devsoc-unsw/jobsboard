import { Request, Response, NextFunction } from "express";
import {
  getRepository
} from "typeorm";
import { Job } from "./entity/job";
import Helpers, { IResponseWithStatus } from "./helpers";
import Logger from "./logging";

const paginatedJobLimit: number = 10;

export default class StudentFunctions {
  /*
  public static async GetAllActiveJobs(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      Logger.Info
      const jobs = await getRepository(Job)
        .createQueryBuilder()
        .select(["company.name", "company.location", "company.description", "Job.id", "Job.role", "Job.description", "Job.applicationLink"])
        .leftJoinAndSelect("Job.company", "company")
        .where("Job.approved = :approved", { approved: true })
        .andWhere("Job.hidden = :hidden", { hidden: false })
        .andWhere("Job.deleted = :deleted", { deleted: false })
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
      return {
        status: 200,
        msg: {
          token: req.newJbToken,
          jobs: fixedJobs
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
  */

  public static async GetPaginatedJobs(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      const offset: number = req.params.offset;
      Logger.Info(`STUDENT=${req.studentZID} getting paginated jobs with OFFSET=${offset}`);
      Helpers.requireParameters(offset);

      const jobs = await getRepository(Job)
        .createQueryBuilder()
        .select(["company.name", "company.location", "company.description", "Job.id", "Job.role", "Job.description", "Job.applicationLink"])
        .leftJoinAndSelect("Job.company", "company")
        .where("Job.approved = :approved", { approved: true })
        .andWhere("Job.hidden = :hidden", { hidden: false })
        .andWhere("Job.deleted = :deleted", { deleted: false })
        .skip(offset)
        .limit(paginatedJobLimit)
        .getMany();

      const fixedJobs = jobs.map((job: Job) => { 
        const newJob: any = {};
        newJob.applicationLink = job.applicationLink;
        newJob.company = job.company;
        newJob.description = job.description;
        newJob.role = job.role;
        newJob.id = job.id;
        return newJob;
      });
      return {
        status: 200,
        msg: {
          token: req.newJbToken,
          jobs: fixedJobs
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

  public static async GetJob(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      Logger.Info(`STUDENT=${req.studentZID} getting individual JOB=${req.params.jobID}`);
      Helpers.requireParameters(req.params.jobID);
      const jobInfo = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Job)
          .createQueryBuilder()
          .select(["company.name", "company.location", "company.description", "Job.id", "Job.role", "Job.description", "Job.applicationLink"])
          .leftJoinAndSelect("Job.company", "company")
          .where("Job.approved = :approved", { approved: true })
          .andWhere("Job.id = :id", { id: parseInt(req.params.jobID, 10) })
          .andWhere("Job.deleted = :deleted", { deleted: false })
          .getOne();
      }, `Failed to find JOB=${req.params.jobID}`);

      return {
        status: 200,
        msg: {
          token: req.newJbToken,
          job: jobInfo
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
