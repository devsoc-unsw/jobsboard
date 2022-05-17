import "reflect-metadata";

import { AppDataSource } from './index';
import Logger from "./logging";
import { AdminAccount } from "./entity/admin_account";
import { Company } from "./entity/company";
import { CompanyAccount } from "./entity/company_account";
import { Job } from "./entity/job";
import Secrets from "./secrets";

export async function seedDB(activeEntities: any[]) {
  Logger.Info("SEEDING DATABASE");
  // clear all tables
  if (process.env.NODE_ENV === "development") {
    Logger.Info("Clearing all tables.");
    await AppDataSource.synchronize(true);
  }

  // create dummy admin account
  const adminAccount = new AdminAccount();
  adminAccount.username = "admin";
  adminAccount.hash = Secrets.hash("incorrect pony plug paperclip");
  await AppDataSource.manager.save(adminAccount);

  // create a company account
  const companyAccount = new CompanyAccount();
  companyAccount.username = "test";
  companyAccount.hash = Secrets.hash("test");
  const company = new Company();
  company.name = "Test company";
  company.location = "Sydney";
  companyAccount.company = company;

  // create a company account used for password reset
  const companyAccount2 = new CompanyAccount();
  companyAccount2.username = "test2";
  companyAccount2.hash = Secrets.hash("test2");
  const company2 = new Company();
  company2.name = "Test company 2";
  company2.location = "Hong Kong";
  companyAccount2.company = company2;

  await AppDataSource.manager.save(companyAccount2);
  
  // every job except job1 and job 2 have not expired yet
  const job1 = new Job();
  job1.role = "Software Engineer and Reliability";
  job1.description = "Doing software engineer things and SRE things";
  job1.applicationLink = "https://sampleapplication.link";
  job1.approved = true;
  job1.hidden = false;
  job1.company = company;
  job1.expiry = new Date('2015-01-01');

  const job2 = new Job();
  job2.role = "Software Engineer";
  job2.description = "Doing software engineer things";
  job2.applicationLink = "mailto:example@example.com";
  job2.approved = true;
  job2.hidden = false;
  job2.company = company;
  job2.expiry = new Date('1995-01-01');

  const job3 = new Job();
  job3.role = "Mechanical Engineer";
  job3.description = "Doing mechanical engineer things";
  job3.applicationLink = "https://sampleapplication.net";
  job3.approved = true;
  job3.company = company;
  job3.expiry = new Date('2032-01-01')

  const job4 = new Job();
  job4.role = "Computer Scientist";
  job4.description = "Computer science and software engineering are both degrees";
  job4.applicationLink = "https://sampleapplicationlink.net";
  job4.company = company;
  job4.approved = true; 
  job4.expiry = new Date('2030-01-10');

  const job5 = new Job();
  job5.role = "Frontend Developer";
  job5.description = "React masters only";
  job5.applicationLink = "https://sampleapplicationlink.net";
  job5.company = company;
  job5.approved = true;
  job5.expiry = new Date('2035-01-01');

  const job6 = new Job();
  job6.role = "Backend Developer";
  job6.description = "Java is not poggers";
  job6.applicationLink = "https://sampleapplicationlink.net";
  job6.company = company;
  job6.approved = true;
  job6.expiry = new Date('2030-01-10');

  companyAccount.company.jobs = [
    job1,
    job2,
    job3,
    job4,
    job5,
    job6,
  ];

  await AppDataSource.manager.save(companyAccount);
  
  Logger.Info("FINISHED SEEDING");
}
