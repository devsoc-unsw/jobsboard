/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Response, NextFunction } from 'express';
import Fuse from 'fuse.js';
import { AppDataSource } from './index';
import { Job } from './entity/job';
import Helpers, { IResponseWithStatus } from './helpers';
import Logger from './logging';

const paginatedJobLimit = 10;

const MapJobsToObjects = (jobs: Job[]) => {
  return jobs.map((job: Job) => {
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
};

export default class StudentFunctions {
  public static async GetPaginatedJobs(this: void, req: any, res: Response, next: NextFunction) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        const offset: number = req.params.offset;
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
          .skip(offset)
          .orderBy('job.expiry', 'ASC')
          .getMany();

        const fixedJobs = MapJobsToObjects(jobs);

        return {
          status: 200,
          msg: {
            jobs: fixedJobs,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      next,
    );
  }

  public static async GetJob(this: void, req: any, res: Response, next: NextFunction) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(`STUDENT=${req.studentZID} getting individual JOB=${req.params.jobID}`);
        Helpers.requireParameters(req.params.jobID);
        const jobInfo = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.getRepository(Job)
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
        }, `Failed to find JOB=${req.params.jobID}`);

        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            job: jobInfo,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      next,
    );
  }

  public static async GetFeaturedJobs(this: void, req: any, res: Response, next: NextFunction) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        Logger.Info(`Attempting to get featured jobs`);
        let featuredJobs = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.getRepository(Job)
            .createQueryBuilder()
            .select([
              'company.logo',
              'Job.id',
              'Job.role',
              'Job.description',
              'Job.workingRights',
              'Job.applicationLink',
            ])
            .leftJoinAndSelect('Job.company', 'company')
            .where('Job.approved = :approved', { approved: true })
            .where('Job.expiry > :expiry', { expiry: new Date() })
            .andWhere('Job.hidden = :hidden', { hidden: false })
            .getMany();
        }, `Couldn't query for featured jobs`);

        // check if there are enough jobs to feature
        if (featuredJobs.length >= 4) {
          featuredJobs = featuredJobs.slice(0, 4);
        } else {
          featuredJobs = featuredJobs.slice(0, featuredJobs.length);
        }

        // select and join company.name
        featuredJobs = featuredJobs.map((job: Job) => {
          // if no jobs are found, return null
          if (job === null) {
            return null;
          }
          const newJob: any = {};
          newJob.id = job.id;
          newJob.logo = job.company.logo.toString();
          newJob.role = job.role;
          newJob.description = job.description;
          newJob.workingRights = job.workingRights;
          newJob.applicationLink = job.applicationLink;
          newJob.company = job.company.name;
          return newJob;
        });

        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            featuredJobs: featuredJobs,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
          msg: {
            token: req.newJbToken,
          },
        } as IResponseWithStatus;
      },
      next,
    );
  }

  public static async SearchJobs(this: void, req: any, res: Response, next: NextFunction) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        Helpers.requireParameters(req.params.queryString);
        Logger.Info(
          `STUDENT=${req.studentZID} attempting to search for jobs with QUERYSTRING=${req.params.queryString}`,
        );
        const queryString = req.params.queryString;

        const allJobs = await Helpers.doSuccessfullyOrFail(async () => {
          return await AppDataSource.getRepository(Job)
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
            .andWhere('Job.deleted = :deleted', { deleted: false })
            .andWhere('Job.hidden = :hidden', { hidden: false })
            .andWhere('Job.expiry > :expiry', { expiry: new Date() })
            .getMany();
        }, `Failed to find jobs in the database`);

        // ? why are there no private functions in TS
        const fixedJobs = MapJobsToObjects(allJobs);
        const fuseInstance = new Fuse(fixedJobs, {
          // weight of keys are normalised back to [0, 1]
          keys: [
            {
              name: 'company.name',
              weight: 4,
            },
            {
              name: 'role',
              weight: 3,
            },
            {
              name: 'mode',
              weight: 2,
            },
            {
              name: 'jobType',
              weight: 2,
            },
          ],
        });

        const filteredResult = fuseInstance.search(queryString);

        return {
          status: 200,
          msg: {
            token: req.newJbToken,
            searchResult: filteredResult,
          },
        } as IResponseWithStatus;
      },
      () => {
        return {
          status: 400,
        } as IResponseWithStatus;
      },
      next,
    );
  }
}
