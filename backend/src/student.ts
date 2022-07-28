import { 
  // Request, 
  Response, 
  NextFunction 
} from "express";
import { AppDataSource } from "./index";
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

      const jobs = await AppDataSource.getRepository(Job)
        .createQueryBuilder("job")
        // TODO(ad-t): not the most gracefull or efficient way to go about this, however
        // I'm not sure whether it's possible to partial select on a join
        .innerJoinAndSelect("job.company", "company")
        .where("job.approved = :approved", { approved: true })
        .andWhere("job.hidden = :hidden", { hidden: false })
        .andWhere("job.deleted = :deleted", { deleted: false })
        .andWhere("job.expiry > :expiry", { expiry: new Date() })
        .take(paginatedJobLimit)
        .skip(offset)
        .orderBy("job.expiry", "ASC")
        .getMany();

      const fixedJobs = jobs.map((job: Job) => { 
        const newCompany: any = {};
        newCompany.name = job.company.name;
        newCompany.description = job.company.description;
        newCompany.location = job.company.location;

        const newJob: any = {};
        newJob.applicationLink = job.applicationLink;
        newJob.company = newCompany;
        newJob.description = job.description;
        newJob.role = job.role;
        newJob.id = job.id;
        newJob.mode = job.mode;
        newJob.studentDemographic = job.studentDemographic;
        newJob.jobType = job.jobType;
        newJob.workingRights = job.workingRights;
        newJob.additionalInfo = job.additionalInfo;
        newJob.wamRequirements = job.wamRequirements;
        newJob.isPaid = job.isPaid;
        return newJob;
      });
      return {
        status: 200,
        msg: {
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
        return await AppDataSource.getRepository(Job)
          .createQueryBuilder()
          .select([
            "company.name",
            "company.location",
            "company.description",
            "Job.id",
            "Job.role",
            "Job.description",
            "Job.applicationLink",
            "Job.mode",
            "Job.studentDemographic",
            "Job.jobType",
            "Job.workingRights",
            "Job.additionalInfo",
            "Job.wamRequirements",
            "Job.isPaid"
          ])
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


  public static async GetFeaturedJobs(req: any, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      Logger.Info(`Attempting to get featured jobs`);
      let featuredJobs = await Helpers.doSuccessfullyOrFail(async () => {
        // TODO(ad-t): doesnt check fields of company, but that's ok for now
        return await AppDataSource
          .getRepository(Job)
          .createQueryBuilder()
          .select(["Job.id", "Job.role", "Job.description", "Job.applicationLink"])
          .where("Job.approved = :approved", { approved: true })
          .where("Job.expiry > :expiry", { expiry: new Date() })
          .andWhere("Job.hidden = :hidden", { hidden: false })
          .leftJoinAndSelect("Job.company", "company")
          .getMany();
      }, `Couldn't query for featured jobs`);

      // If more than 4 featured jobs, return the first 4 else return all
      if(featuredJobs.length >= 4){
        featuredJobs = featuredJobs.slice(0, 4);}
      else{
        featuredJobs = featuredJobs.slice(0, featuredJobs.length);
      }
      
      // Select and Join company.name
      featuredJobs = featuredJobs.map((job: Job) => {
        // If no jobs are found, return null
        if(job === null){
          return null;
        }
        const newJob: any = {};
        newJob.id = job.id;
        newJob.role = job.role;
        newJob.description = job.description;
        newJob.applicationLink = job.applicationLink;
        newJob.company = job.company.name;
        return newJob;
      }
      );
      
      return {
        status: 200, 
        msg: {
          token: req.newJbToken,
          featuredJobs: featuredJobs
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
