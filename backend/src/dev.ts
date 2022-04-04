import "reflect-metadata";
import {
  Connection,
  getConnection,
  getManager,
  EntityManager,
} from "typeorm";

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
    await getConnection().synchronize(true);
  }
  const conn: Connection = getConnection();
  const manager: EntityManager = getManager();

  // create dummy admina ccount
  const adminAccount = new AdminAccount();
  adminAccount.username = "admin";
  adminAccount.hash = Secrets.hash("incorrect pony plug paperclip");
  await manager.save(adminAccount);

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
  job1.approved = true;
  job1.hidden = false;
  job1.company = company;
  job1.mode = "remote";
  job1.studentDemographic = ["all"];
  job1.jobType = "intern";
  job1.workingRights = ["aus_ctz", "aus_perm_res"];
  job1.wamRequirements = "HD";
  job1.additionalInfo = "";
  job1.isPaid = true;


  const job2 = new Job();
  job2.role = "Software Engineer";
  job2.description = "Doing software engineer things";
  job2.applicationLink = "mailto:example@example.com";
  job2.approved = true;
  job2.hidden = false;
  job2.company = company;
  job2.mode = "remote";
  job2.studentDemographic = ["all"];
  job2.jobType = "intern";
  job2.workingRights = ["aus_ctz", "aus_perm_res"];
  job2.wamRequirements = "C";
  job2.additionalInfo = "";
  job2.isPaid = true;


  const job3 = new Job();
  job3.role = "Mechanical Engineer";
  job3.description = "Doing mechanical engineer things";
  job3.applicationLink = "https://sampleapplication.net";
  job3.approved = true;
  job3.company = company;
  job3.mode = "hybrid";
  job3.studentDemographic = ["final_year", "penultimate"];
  job3.jobType = "grad";
  job3.workingRights = ["all"];
  job3.wamRequirements = "none";
  job3.additionalInfo = "";
  job3.isPaid = true;


  const job4 = new Job();
  job4.role = "Computer Scientist";
  job4.description = "Computer science and software engineering are both degrees";
  job4.applicationLink = "https://sampleapplicationlink.net";
  job4.company = company;
  job4.approved = true;
  job4.mode = "remote";
  job4.studentDemographic = ["all"];
  job4.jobType = "intern";
  job4.workingRights = ["aus_ctz", "aus_perm_res", "aus_stud_visa"];
  job4.wamRequirements = "HD";
  job4.additionalInfo = "";
  job4.isPaid = true;

  companyAccount.company.jobs = [
    job1,
    job2,
    job3,
    job4,
  ];
  await manager.save(companyAccount);
  Logger.Info("FINISHED SEEDING");
}
