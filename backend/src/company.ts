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
import Logger from "./logging";
import JWT from "./jwt";
import Secrets from "./secrets";

export default class CompanyFunctions {
  public static async GetCompanyInfo(req: Request, res: Response) {
    try {
      const companyInfo = await getRepository(Company).find({id: parseInt(req.params.companyID, 10)});
      if (companyInfo.length !== 1) {
        throw new Error("Cannot find the requested company.");
      }
      res.send(companyInfo);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async GetJobsFromCompany(req: Request, res: Response) {
    try {
      const jobsForCompany = await getRepository(Company).find({id: parseInt(req.params.companyID, 10)});
      res.send(jobsForCompany[0].jobs);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async CreateCompany(req: Request, res: Response) {
    try {
      // verify input paramters
      const msg = JSON.parse(req.body);
      Helpers.requireParameters(msg.username && msg.password && msg.name && msg.location);
      // check if the company account exists with the same name
      const newUsername = msg.username;
      const conn: Connection = await getConnection();
      const companyAccountSearchResult = await getRepository(CompanyAccount).find({
        username: newUsername,
      });
      if (companyAccountSearchResult.length !== 0) {
        // company exists, send conflict error
        res.sendStatus(409);
      }
      // if there is no conflict, create the company account and company record
      const newCompany = new Company();
      newCompany.name = msg.name;
      newCompany.location = msg.location;
      const newCompanyAccount = new CompanyAccount();
      newCompanyAccount.username = msg.username;
      newCompanyAccount.hash = Secrets.hash(msg.password);
      newCompanyAccount.company = newCompany;
      await conn.manager.save(newCompany);
      await conn.manager.save(newCompanyAccount);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async AuthenticateCompany(req: Request, res: Response) {
    try {
      const msg = { username: req.body.username, password: req.body.password };
      Helpers.requireParameters(msg.username && msg.password);
      // check if account exists
      const companyQuery = await getRepository(CompanyAccount).findOneOrFail({
        username: msg.username,
      }).catch((error) => { throw new Error(error); });
      try {
        if (companyQuery.hash !== Secrets.hash(msg.password)) { throw new Error("Invalid credentials"); }
        // credentials match, so grant them a token
        res.send({ token: JWT.create({ id: companyQuery.id }) });
      } catch (error) {
        res.sendStatus(401);
      }
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
      const msg = JSON.parse(req.body);
      Helpers.requireParameters(msg.role && msg.description);
      const conn: Connection = getConnection();
      const newJob = new Job();
      newJob.role = msg.role;
      newJob.description = msg.description;
      const companyQuery = await getRepository(Company).findOneOrFail({
        id: req.companyID,
      }).catch((error) => { throw new Error(error); });
      newJob.company = companyQuery;
      await conn.manager.save(newJob);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(400);
    }
  }
}
