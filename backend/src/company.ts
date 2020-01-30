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
import MailFunctions from "./mail";
import Logger from "./logging";

export default class CompanyFunctions {
  public static async GetCompanyInfo(req: Request, res: Response) {
    try {
      const companyInfo = await getRepository(Company).findOneOrFail({
        where: {
          id: parseInt(req.params.companyID, 10)
        },
      });
      res.send(companyInfo);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async GetJobsFromCompany(req: Request, res: Response) {
    try {
      const companyAccountQuery = await getRepository(CompanyAccount).findOneOrFail({
        relations: ["company", "company.jobs"],
        where: {
          id: parseInt(req.params.companyID, 10),
        },
      });
      // filter out any jobs that are not approved or are hidden
      const fixedCompanyJobs = companyAccountQuery.company.jobs.filter( (job) => job.approved && !job.hidden);
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
      newCompany.companyAccount = newCompanyAccount;
      await conn.manager.save(newCompanyAccount);
      MailFunctions.AddMailToQueue(
        newCompanyAccount.username,
        "Thank you for adding your company to the CSESoc Jobs Board",
        `
Thank you for registering your company with the CSESoc Jobs Board. We really appreciate your time and are looking forward to working with you to share amazing opportunities with our students.
<br>
Please contact our executive committee at <a href="mailto:info@csesoc.org.au">info@csesoc.org.au</a> to verify your company account.
<br>
Best regards,
Adam Tizzone
CSESoc Jobs Board Administrator
        `,
      );
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async CreateJob(req: any, res: Response) {
    try {
      if (req.companyAccountID === undefined) {
        res.sendStatus(401);
        return;
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
      const companyAccountQuery = await getRepository(CompanyAccount).find({
        id: req.companyAccountID,
      });
      if (companyAccountQuery.length !== 1) {
        throw new Error(`Didn't find exactly one occurrence of an account with ID: ${req.companyAccountID}`);
      }
      const companyAccount = companyAccountQuery[0]
      newJob.company = companyAccount.company;
      await conn.manager.save(newJob);
      Logger.Info(JSON.stringify(newJob));
      Logger.Info(JSON.stringify(companyAccountQuery));
      MailFunctions.AddMailToQueue(
        companyAccount.username,
        "CSESoc Jobs Board - Job Post request submitted",
        `
Thank you for adding a job post to the CSESoc Jobs Board. As part of our aim to ensure student safety, we check all job posting requests to ensure they follow our guidelines, as the safety of our students is our utmost priority.
<br>
A result will be sent to you shortly.
<br>
Best regards,
Adam Tizzone
CSESoc Jobs Board Administrator
        `,
      );
      res.send({ id: newJob.id });
    } catch (error) {
      Logger.Error(error);
      res.sendStatus(400);
    }
  }
}
