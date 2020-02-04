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
      const companyInfo = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Company)
          .createQueryBuilder()
          .where("company.id = :id", { id: parseInt(req.params.companyID, 10) })
          .getOne();
      }, `Company ${req.params.companyID} not found.`);
      res.send(companyInfo);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async GetJobsFromCompany(req: Request, res: Response) {
    try {
      const companyJobs = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Company)
          .createQueryBuilder()
          .where("company.id = :id", { id: parseInt(req.params.companyID, 10) })
          .getOne();
      }, `Couldn't find jobs for company with ID: ${req.params.companyID}`);

      companyJobs.jobs = await Helpers.doSuccessfullyOrFail(async () => {
        return await getConnection()
          .createQueryBuilder()
          .relation(Company, "jobs")
          .of(companyJobs)
          .loadMany();
      }, `Couldn't load jobs for company with ID: ${req.params.companyID}`);
      // filter out any jobs that are not approved or are hidden
      const fixedCompanyJobs = companyJobs.jobs.filter( (job: Job) => job.approved && !job.hidden);
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
      const companyAccountUsernameSearchResult = await getRepository(CompanyAccount)
        .createQueryBuilder("company_account")
        .where("company_account.username = :username", { username: msg.username })
        .getOne();
      const companyNameSearchResult = await getRepository(Company)
        .createQueryBuilder("company")
        .where("company.name = :name", { name: msg.name })
        .getOne();
      if (companyAccountUsernameSearchResult !== undefined || companyNameSearchResult !== undefined) {
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

      // await conn.manager.save(newCompanyAccount);
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
      Logger.Error(error);
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

      let companyAccount: CompanyAccount = undefined;
      try {
        companyAccount = await Helpers.doSuccessfullyOrFail(async () => {
          return await getRepository(CompanyAccount)
            .createQueryBuilder("company_account")
            .where("company_account.id = :id", { id: req.companyAccountID })
            .andWhere("company_account.verified = :verified", { verified: true })
            .getOne();
        }, `Couldn't find company account with ID ${req.companyAccountID}`);
      } catch (error) {
        // reject because a verified account could not be found and thus can't post a job
        res.sendStatus(403)
      }

      companyAccount.company = await Helpers.doSuccessfullyOrFail(async () => {
        return await conn.createQueryBuilder()
          .relation(CompanyAccount, "company")
          .of(companyAccount)
          .loadOne();
      }, `Couldn't load company for company account with ID ${req.companyAccountID}`);

      newJob.company = companyAccount.company;

      await conn.manager.save(newJob);

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
