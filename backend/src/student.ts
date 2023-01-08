import { Response, NextFunction } from 'express';
import { AppDataSource } from './config';
import Job from './entity/job';
import Helpers, { IResponseWithStatus } from './helpers';
import Logger from './logging';

import {
  JobMode,
  StudentDemographic,
  JobType,
  WorkingRights,
  WamRequirements,
} from './types/job-field';

import {
  JobBase,
  CompanyBase,
  StudentPaginatedJobsRequest,
  StudentGetJobRequest,
  StudentFeaturedJobsRequest,
} from './interfaces/interfaces';

const paginatedJobLimit = 10;

export default class StudentFunctions {
  public static async GetPaginatedJobs(
    this: void,
    req: StudentPaginatedJobsRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        const { offset } = req.params;
        Logger.Info(`STUDENT=${req.studentZID} getting paginated jobs with OFFSET=${offset}`);
        Helpers.requireParameters(offset);

        const jobs = await AppDataSource.getRepository(Job)
          .createQueryBuilder('job')
          // TODO(ad-t): not the most gracefull or efficient way to go about this, however
          // I'm not sure whether it's possible to partial select on a join
          .innerJoinAndSelect('job.company', 'company')
          .where('job.approved = :approved', { approved: true })
          .andWhere('job.hidden = :hidden', { hidden: false })
          .andWhere('job.deleted = :deleted', { deleted: false })
          .andWhere('job.expiry > :expiry', { expiry: new Date() })
          .take(paginatedJobLimit)
          .skip(parseInt(offset, 10))
          .orderBy('job.expiry', 'ASC')
          .getMany();

        const fixedJobs: JobBase[] = jobs.map((job: Job) => {
          const newCompany: CompanyBase = {
            name: job.company.name,
            description: job.company.description,
            location: job.company.location,
          };

          const newJob: {
            applicationLink: string;
            company: typeof newCompany;
            description: string;
            role: string;
            id: number;
            mode: JobMode;
            studentDemographic: StudentDemographic[];
            jobType: JobType;
            workingRights: WorkingRights[];
            additionalInfo: string;
            wamRequirements: WamRequirements;
            isPaid: boolean;
          } = {
            applicationLink: job.applicationLink,
            company: newCompany,
            description: job.description,
            role: job.role,
            id: job.id,
            mode: job.mode,
            studentDemographic: job.studentDemographic,
            jobType: job.jobType,
            workingRights: job.workingRights,
            additionalInfo: job.additionalInfo,
            wamRequirements: job.wamRequirements,
            isPaid: job.isPaid,
          };
          return newJob;
        });
        return {
          status: 200,
          msg: {
            jobs: fixedJobs,
          },
        } as IResponseWithStatus;
      },
      () => ({
        status: 400,
        msg: {
          token: req.newJbToken,
        },
      } as IResponseWithStatus),
      next,
    );
  }

  public static async GetJob(
    this: void,
    req: StudentGetJobRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(`STUDENT=${req.studentZID} getting individual JOB=${req.params.jobID}`);
        Helpers.requireParameters(req.params.jobID);
        const jobInfo: Job = await AppDataSource.getRepository(Job)
          .createQueryBuilder()
          .select([
            'company.name',
            'company.location',
            'company.description',
            'Job.id',
            'Job.role',
            'Job.description',
            'Job.applicationLink',
            'Job.mode',
            'Job.studentDemographic',
            'Job.jobType',
            'Job.workingRights',
            'Job.additionalInfo',
            'Job.wamRequirements',
            'Job.isPaid',
            'Job.expiry',
          ])
          .leftJoinAndSelect('Job.company', 'company')
          .where('Job.approved = :approved', { approved: true })
          .andWhere('Job.id = :id', { id: parseInt(req.params.jobID, 10) })
          .andWhere('Job.deleted = :deleted', { deleted: false })
          .getOne();

        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            job: jobInfo,
          },
        } as IResponseWithStatus;
      },
      () => ({
        status: 400,
        msg: {
          token: req.newJbToken,
        },
      } as IResponseWithStatus),
      next,
    );
  }

  public static async GetFeaturedJobs(
    this: void,
    req: StudentFeaturedJobsRequest,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info('Attempting to get featured jobs');
        // TODO(ad-t): doesnt check fields of company, but that's ok for now
        let jobs = await AppDataSource.getRepository(Job)
          .createQueryBuilder()
          .select(['Job.id', 'Job.role', 'Job.description', 'Job.applicationLink'])
          .where('Job.approved = :approved', { approved: true })
          .where('Job.expiry > :expiry', { expiry: new Date() })
          .andWhere('Job.hidden = :hidden', { hidden: false })
          .leftJoinAndSelect('Job.company', 'company')
          .getMany();

        // check if there are enough jobs to feature
        if (jobs.length >= 4) {
          jobs = jobs.slice(0, 4);
        } else {
          jobs = jobs.slice(0, jobs.length);
        }

        const featuredJobs: JobBase[] = jobs.map((job: Job) => {
          if (job === null) {
            return null;
          }
          const newJob: JobBase = {
            id: job.id,
            role: job.role,
            description: job.description,
            applicationLink: job.applicationLink,
            company: job.company,
          };
          return newJob;
        });

        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            featuredJobs,
          },
        } as IResponseWithStatus;
      },
      () => ({
        status: 400,
        msg: {
          token: req.newJbToken,
        },
      } as IResponseWithStatus),
      next,
    );
  }
}
