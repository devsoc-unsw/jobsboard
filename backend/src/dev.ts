import "reflect-metadata";

import { AppDataSource } from './index';
import Logger from "./logging";
import { AdminAccount } from "./entity/admin_account";
import { Company } from "./entity/company";
import { CompanyAccount } from "./entity/company_account";
import { Job } from "./entity/job";
import { Statistics } from "./entity/statistics";
import Secrets from "./secrets";
import { JobMode, JobType, StudentDemographic, WamRequirements, WorkingRights } from "./types/job-field";

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

  // create a verified company account
  const companyAccount = new CompanyAccount();
  companyAccount.username = "test";
  companyAccount.hash = Secrets.hash("test");
  companyAccount.verified = true;
  const company = new Company();
  company.name = "Test company";
  company.location = "Sydney";
  companyAccount.company = company;
  
  // every job except job1 and job 2 have not expired yet
  const job1 = new Job();
  job1.role = "Software Engineer and Reliability";
  job1.description = "Doing software engineer things and SRE things";
  job1.applicationLink = "https://sampleapplication.link";
  job1.approved = true;
  job1.hidden = false;
  job1.company = company;
  job1.mode = JobMode.Remote;
  job1.studentDemographic = [StudentDemographic.All];
  job1.jobType = JobType.Intern;
  job1.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes];
  job1.wamRequirements = WamRequirements.HD;
  job1.additionalInfo = "";
  job1.isPaid = true;
  job1.expiry = new Date('2015-01-01');

  const job2 = new Job();
  job2.role = "Software Engineer";
  job2.description = "Doing software engineer things";
  job2.applicationLink = "mailto:example@example.com";
  job2.approved = true;
  job2.hidden = false;
  job2.company = company;
  job2.mode = JobMode.Remote;
  job2.studentDemographic = [StudentDemographic.All];
  job2.jobType = JobType.Intern;
  job2.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes];
  job2.wamRequirements = WamRequirements.C;
  job2.additionalInfo = "";
  job2.isPaid = true;
  job2.expiry = new Date('1995-01-01');

  const job3 = new Job();
  job3.role = "Mechanical Engineer";
  job3.description = "Doing mechanical engineer things";
  job3.applicationLink = "https://sampleapplication.net";
  job3.approved = true;
  job3.company = company;
  job3.mode = JobMode.Hybrid;
  job3.studentDemographic = [StudentDemographic.FinalYear, StudentDemographic.Penultimate];
  job3.jobType = JobType.Grad;
  job3.workingRights = [WorkingRights.All];
  job3.wamRequirements = WamRequirements.None;
  job3.additionalInfo = "";
  job3.isPaid = true;
  job3.expiry = new Date('2032-01-01')

  const job4 = new Job();
  job4.role = "Computer Scientist";
  job4.description = "Computer science and software engineering are both degrees";
  job4.applicationLink = "https://sampleapplicationlink.net";
  job4.company = company;
  job4.approved = true;
  job4.mode = JobMode.Remote;
  job4.studentDemographic = [StudentDemographic.All];
  job4.jobType = JobType.Intern;
  job4.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes, WorkingRights.AusStudVisa];
  job4.wamRequirements = WamRequirements.HD;
  job4.additionalInfo = "";
  job4.isPaid = true;
  job4.approved = true; 
  job4.expiry = new Date('2030-01-10');

  const job5 = new Job();
  job5.role = "Frontend Developer";
  job5.description = "React masters only";
  job5.applicationLink = "https://sampleapplicationlink.net";
  job5.company = company;
  job5.approved = true;
  job5.expiry = new Date('2035-01-01');
  job5.mode = JobMode.Remote;
  job5.studentDemographic = [StudentDemographic.All];
  job5.jobType = JobType.Intern;
  job5.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes, WorkingRights.AusStudVisa];
  job5.wamRequirements = WamRequirements.HD;
  job5.additionalInfo = "";
  job5.isPaid = true;

  const job6 = new Job();
  job6.role = "Backend Developer";
  job6.description = "Java is not poggers";
  job6.applicationLink = "https://sampleapplicationlink.net";
  job6.company = company;
  job6.approved = true;
  job6.expiry = new Date('2030-01-10');
  job6.mode = JobMode.Remote;
  job6.studentDemographic = [StudentDemographic.All];
  job6.jobType = JobType.Intern;
  job6.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes, WorkingRights.AusStudVisa];
  job6.wamRequirements = WamRequirements.HD;
  job6.additionalInfo = "";
  job6.isPaid = true;
  
  // following two jobs are used for testing retrieving number of verified job posts
  const job7 = new Job();
  job7.role = "verified job 1";
  job7.description = "Java is not poggers";
  job7.applicationLink = "https://sampleapplicationlink.net";
  job7.company = company;
  job7.approved = true;
  job7.expiry = new Date('2030-01-10');
  job7.mode = JobMode.Remote;
  job7.studentDemographic = [StudentDemographic.All];
  job7.jobType = JobType.Intern;
  job7.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes, WorkingRights.AusStudVisa];
  job7.wamRequirements = WamRequirements.HD;
  job7.additionalInfo = "";
  job7.isPaid = true;
  job7.createdAt = new Date('1999-5-10')
  
  const job8 = new Job();
  job8.role = "verified job 1";
  job8.description = "Java is not poggers";
  job8.applicationLink = "https://sampleapplicationlink.net";
  job8.company = company;
  job8.approved = true;
  job8.expiry = new Date('2030-01-10');
  job8.mode = JobMode.Remote;
  job8.studentDemographic = [StudentDemographic.All];
  job8.jobType = JobType.Intern;
  job8.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes, WorkingRights.AusStudVisa];
  job8.wamRequirements = WamRequirements.HD;
  job8.additionalInfo = "";
  job8.isPaid = true;
  job8.createdAt = new Date('1999-10-10')

  companyAccount.company.jobs = [
    job1,
    job2,
    job3,
    job4,
    job5,
    job6,
    job7,
    job8
  ];

  await AppDataSource.manager.save(companyAccount);
  
  // create an unverfied company account 
  const companyAccount2 = new CompanyAccount();
  companyAccount2.username = "test2";
  companyAccount2.hash = Secrets.hash("test2");
  companyAccount.verified = false;
  const company2 = new Company();
  company2.name = "Test company 2";
  company2.location = "Hong Kong";
  companyAccount2.company = company2;

  await AppDataSource.manager.save(companyAccount2);
  
  // create another verified company account for tests 
  const companyAccount3 = new CompanyAccount();
  companyAccount3.username = "test3";
  companyAccount3.hash = Secrets.hash("test3");
  companyAccount3.verified = true;
  const company3 = new Company();
  company3.name = "Test company 3";
  company3.location = "Singapore";
  companyAccount3.company = company3;
  
  // normal approved job
  const ca3Job1 = new Job();
  ca3Job1.role = "approved job";
  ca3Job1.description = "Java is not poggers";
  ca3Job1.applicationLink = "https://sampleapplicationlink.net";
  ca3Job1.company = company3;
  ca3Job1.approved = true;
  ca3Job1.expiry = new Date('2030-01-10');
  ca3Job1.mode = JobMode.Remote;
  ca3Job1.studentDemographic = [StudentDemographic.All];
  ca3Job1.jobType = JobType.Intern;
  ca3Job1.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes, WorkingRights.AusStudVisa];
  ca3Job1.wamRequirements = WamRequirements.HD;
  ca3Job1.additionalInfo = "";
  ca3Job1.isPaid = true;
  ca3Job1.createdAt = new Date('2020-10-10')
  
  // approved but expired job
  const ca3Job2 = new Job();
  ca3Job2.role = "expired job";
  ca3Job2.description = "Java is not poggers";
  ca3Job2.applicationLink = "https://sampleapplicationlink.net";
  ca3Job2.company = company3;
  ca3Job2.approved = true;
  ca3Job2.expiry = new Date('2003-01-28');
  ca3Job2.mode = JobMode.Remote;
  ca3Job2.studentDemographic = [StudentDemographic.All];
  ca3Job2.jobType = JobType.Intern;
  ca3Job2.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes, WorkingRights.AusStudVisa];
  ca3Job2.wamRequirements = WamRequirements.HD;
  ca3Job2.additionalInfo = "";
  ca3Job2.isPaid = true;
  ca3Job2.createdAt = new Date('2020-10-10')
  
  // approved but hidden job
  const ca3Job3 = new Job();
  ca3Job3.role = "hidden job";
  ca3Job3.description = "Java is not poggers";
  ca3Job3.applicationLink = "https://sampleapplicationlink.net";
  ca3Job3.company = company3;
  ca3Job3.approved = true;
  ca3Job3.expiry = new Date('2003-01-28');
  ca3Job3.mode = JobMode.Remote;
  ca3Job3.studentDemographic = [StudentDemographic.All];
  ca3Job3.jobType = JobType.Intern;
  ca3Job3.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes, WorkingRights.AusStudVisa];
  ca3Job3.wamRequirements = WamRequirements.HD;
  ca3Job3.additionalInfo = "";
  ca3Job3.isPaid = true;
  ca3Job3.hidden = true;
  ca3Job3.createdAt = new Date('2020-10-10')
  
  // approved by deleted job 
  const ca3Job4 = new Job();
  ca3Job4.role = "deleted job";
  ca3Job4.description = "Java is not poggers";
  ca3Job4.applicationLink = "https://sampleapplicationlink.net";
  ca3Job4.company = company3;
  ca3Job4.approved = true;
  ca3Job4.expiry = new Date('2003-01-28');
  ca3Job4.mode = JobMode.Remote;
  ca3Job4.studentDemographic = [StudentDemographic.All];
  ca3Job4.jobType = JobType.Intern;
  ca3Job4.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes, WorkingRights.AusStudVisa];
  ca3Job4.wamRequirements = WamRequirements.HD;
  ca3Job4.additionalInfo = "";
  ca3Job4.isPaid = true;
  ca3Job4.deleted = true;
  ca3Job4.createdAt = new Date('2020-10-10')
  
  companyAccount3.company.jobs = [
    ca3Job1,
    ca3Job2,
    ca3Job3,
    ca3Job4
  ];
  
  await AppDataSource.manager.save(companyAccount3);
  
  // create a testing statistic 
  const stats1 = new Statistics();
  stats1.year = 2000;
  stats1.numJobPosts = 7;
  await AppDataSource.manager.save(stats1);
  
  Logger.Info("FINISHED SEEDING");
}
