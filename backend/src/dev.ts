import "reflect-metadata";
import {
  Connection,
  getConnection,
} from "typeorm";

import Logger from "./logging";

import { AdminAccount } from "./entity/admin_account";
import { Company } from "./entity/company";
import { CompanyAccount } from "./entity/company_account";
import { Job } from "./entity/job";
import Secrets from "./secrets";

export async function seedDB(activeEntities: any[]) {
  // clear all tables
  if (process.env.NODE_ENV === "development") {
    Logger.Info("Clearing all tables.");
    await getConnection().synchronize(true);
  }
  const conn: Connection = await getConnection();

  // create dummy admina ccount
  const adminAccount = new AdminAccount();
  adminAccount.username = "admin";
  adminAccount.hash = Secrets.hash("admin");
  await conn.manager.save(adminAccount);

  // create a company account
  const companyAccount = new CompanyAccount();
  companyAccount.username = "test";
  companyAccount.hash = Secrets.hash("test");
  const company = new Company();
  company.name = "Test company";
  company.location = "Sydney";
  companyAccount.company = company;
  const job1 = new Job();
  job1.role = "Software Engineer and Reliability";
  job1.description = "Doing software engineer things and SRE things";
  job1.applicationLink = "https://sampleapplication.link";
  job1.company = company;
  const job2 = new Job();
  job2.role = "Software Engineer";
  job2.description = "Doing software engineer things";
  job1.applicationLink = "mailto:example@example.com";
  job2.company = company;
  const job3 = new Job();
  job3.role = "Mechanical Engineer";
  job3.description = "Doing mechanical engineer things";
  job1.applicationLink = "https://sampleapplication.net";
  job3.company = company;
  const job4 = new Job();
  job4.role = "Computer Scientist";
  job4.description = "Computer science and software engineering are both degrees";
  job1.applicationLink = "https://sampleapplicationlink.net";
  job4.company = company;
  companyAccount.company.jobs = [
    job1,
    job2,
    job3,
    job4,
  ];
  await conn.manager.save(companyAccount);
  Logger.Info("Finished seeding.");
}
