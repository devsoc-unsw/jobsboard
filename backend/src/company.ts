import { Request, Response } from "express";
import {
  Connection,
  getConnection,
  getRepository,
} from "typeorm";
import { Company } from "./entity/company";
import { CompanyAccount } from "./entity/company_account";
import { Job } from "./entity/job";
import Helpers from "./helpers";
import Secrets from "./secrets";

export default class CompanyFunctions {
  public static async GetCompanyInfo(req: Request, res: Response) {
    try {
      const companyInfo = await getRepository(Company).find({id: parseInt(req.params.companyID, 10)});
      if (companyInfo.length !== 1) {
        throw new Error("Cannot find the requested company.");
      }
      res.send(companyInfo[0]);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async GetJobsFromCompany(req: Request, res: Response) {
    try {
      const jobsForCompany = await getRepository(Company).find({
        relations: ["jobs"],
        where: {
          id: parseInt(req.params.companyID, 10),
        },
      });
      // filter out any jobs that are not approved or are hidden
      const fixedCompanyJobs = jobsForCompany[0].jobs.filter( (job) => job.approved && !job.hidden);
      res.send(fixedCompanyJobs);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async CreateCompany(req: Request, res: Response) {
    try {
      // verify input paramters
      const msg = {
        location: req.body.location,
        name: req.body.name,
        password: req.body.password,
        username: req.body.username,
      };
      Helpers.requireParameters(msg.username);
      Helpers.requireParameters(msg.password);
      Helpers.requireParameters(msg.name);
      Helpers.requireParameters(msg.location);
      // check if the company account exists with the same name
      const conn: Connection = getConnection();
      // using the original typeorm OR convention fails to construct a suitable MySQL
      // query, so we have to do this in two separate queries
      const companyAccountUsernameSearchResult = await getRepository(CompanyAccount).find({
        username: msg.username,
      });
      const companyNameSearchResult = await getRepository(Company).find({
        name: msg.name,
      });
      if (companyAccountUsernameSearchResult.length !== 0 || companyNameSearchResult.length !== 0) {
        // company exists, send conflict error
        res.sendStatus(409);
        return;
      }
      // if there is no conflict, create the company account and company record
      const newCompany = new Company();
      newCompany.name = msg.name;
      newCompany.location = msg.location;
      const newCompanyAccount = new CompanyAccount();
      newCompanyAccount.username = msg.username;
      newCompanyAccount.hash = Secrets.hash(msg.password);
      newCompanyAccount.company = newCompany;
      await conn.manager.save(newCompanyAccount);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async CreateJob(req: any, res: Response) {
    try {
      if (req.companyID === undefined) {
        res.sendStatus(401);
      }
      // ensure required parameters are present
      const msg = {
        applicationLink: req.body.applicationLink.trim(),
        description: req.body.description.trim(),
        role: req.body.role.trim(),
      };
      Helpers.requireParameters(msg.role);
      Helpers.requireParameters(msg.description);
      Helpers.requireParameters(msg.applicationLink);
      Helpers.validApplicationLink(msg.applicationLink);
      const conn: Connection = getConnection();
      const newJob = new Job();
      newJob.role = msg.role;
      newJob.description = msg.description;
      newJob.applicationLink = msg.applicationLink;
      const companyQuery = await getRepository(Company).findOneOrFail({
        id: req.companyID,
      }).catch((error) => { throw new Error(error); });
      newJob.company = companyQuery;
      await conn.manager.save(newJob);
      res.send({ id: newJob.id });
    } catch (error) {
      res.sendStatus(400);
    }
  }
}
