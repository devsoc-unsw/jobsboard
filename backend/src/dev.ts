import 'reflect-metadata';

import { AppDataSource } from './config';
import { Logger, LogModule } from './logging';
import AdminAccount from './entity/admin_account';
import Company from './entity/company';
import CompanyAccount from './entity/company_account';
import Job from './entity/job';
import Statistics from './entity/statistics';
import Secrets from './secrets';
import {
  JobMode,
  JobType,
  StudentDemographic,
  WamRequirements,
  WorkingRights,
} from './types/job-field';
import { AdminAccountInterface, CompanyAccountInterface } from './tests/test-types';
import testdata from './tests/default_test_data.json';
import { env } from './environment';

const LM = new LogModule('DEV');

const CreateAdminAccounts = async (admins: AdminAccountInterface[]) => {
  const promises = [];
  for (let i = 0; i < admins.length; i += 1) {
    const adminAccount = new AdminAccount();
    adminAccount.username = admins[i].username;
    adminAccount.hash = Secrets.hash(admins[i].password);
    promises.push(AppDataSource.manager.save(adminAccount));
  }
  await Promise.all(promises);
};

const ProcessCompanyAccounts = (companies: CompanyAccountInterface[]) => {
  const res: Record<string, CompanyAccount> = {};
  companies.forEach((company) => {
    const companyAccount = new CompanyAccount();
    companyAccount.username = company.username;
    companyAccount.hash = Secrets.hash(company.password);
    companyAccount.verified = company.verified;
    const newCompany = new Company();
    newCompany.name = company.name;
    newCompany.location = company.location;
    newCompany.jobs = [];
    companyAccount.company = newCompany;
    res[company.username] = companyAccount;
  });
  return res;
};

const ProcessNewJobs = (companyAccs: Record<string, CompanyAccount>) => {
  testdata.jobs.forEach((job) => {
    const newJob = new Job();
    newJob.role = job.role;
    newJob.description = job.description;
    newJob.applicationLink = job.application_link;
    newJob.approved = job.approved;
    newJob.hidden = job.hidden;
    newJob.mode = job.mode as JobMode;
    newJob.studentDemographic = job.student_demographic as StudentDemographic[];
    newJob.jobType = job.type as JobType;
    newJob.workingRights = job.working_rights as WorkingRights[];
    newJob.wamRequirements = job.wam_requirements as WamRequirements;
    newJob.additionalInfo = job.additional_info;
    newJob.isPaid = job.paid;
    newJob.expiry = new Date(job.expiry);
    companyAccs[job.company_username].company.jobs.push(newJob);
  });
};

const CreateTestObjectsFromJSON = async () => {
  await CreateAdminAccounts(testdata.admins);

  const companyAccs = ProcessCompanyAccounts(testdata.companies);
  ProcessNewJobs(companyAccs);

  const accounts = Object.values(companyAccs);
  const promises = [];
  for (let i = 0; i < accounts.length; i += 1) {
    promises.push(AppDataSource.manager.save(accounts[i]));
  }
  await Promise.all(promises);
};

export default async function seedDB() {
  Logger.Info(LM, 'SEEDING DATABASE');
  // clear all tables
  if (env.NODE_ENV === 'development') {
    Logger.Info(LM, 'Clearing all tables.');
    await AppDataSource.synchronize(true);
  }

  // The data below is used for backend testing. DO NOT REMOVE.
  // create dummy admin account
  const adminAccount = new AdminAccount();
  adminAccount.username = 'admin';
  adminAccount.hash = Secrets.hash('incorrect pony plug paperclip');
  await AppDataSource.manager.save(adminAccount);

  const canva = new CompanyAccount();
  canva.username = 'canva';
  canva.hash = Secrets.hash('canva');
  canva.verified = true;
  const canva_ = new Company();
  canva_.name = 'Canva';
  canva_.location = 'Sydney';
  canva.company = canva_;

  const atlassian = new CompanyAccount();
  atlassian.username = 'atlassian';
  atlassian.hash = Secrets.hash('atlassian');
  atlassian.verified = true;
  const atlassian_ = new Company();
  atlassian_.name = 'Atlassian';
  atlassian_.location = 'Sydney';
  atlassian.company = atlassian_;

  const amazon = new CompanyAccount();
  amazon.username = 'amazon';
  amazon.hash = Secrets.hash('amazon');
  amazon.verified = true;
  const amazon_ = new Company();
  amazon_.name = 'amazon';
  amazon_.location = 'Sydney';
  amazon.company = amazon_;

  const janeStreet = new CompanyAccount();
  janeStreet.username = 'jane street';
  janeStreet.hash = Secrets.hash('jane street');
  janeStreet.verified = true;
  const janeStreet_ = new Company();
  janeStreet_.name = 'Jane Street';
  janeStreet_.location = 'Sydney';
  janeStreet.company = janeStreet_;

  const optiver = new CompanyAccount();
  optiver.username = 'optiver';
  optiver.hash = Secrets.hash('optiver');
  optiver.verified = true;
  const optiver_ = new Company();
  optiver_.name = 'Optiver';
  optiver_.location = 'Sydney';
  optiver.company = optiver_;

  const google = new CompanyAccount();
  google.username = 'google';
  google.hash = Secrets.hash('google');
  google.verified = true;
  const google_ = new Company();
  google_.name = 'Google';
  google_.location = 'Sydney';
  google.company = google_;

  const pearler = new CompanyAccount();
  pearler.username = 'pearler';
  pearler.hash = Secrets.hash('pearler');
  pearler.verified = true;
  const pearler_ = new Company();
  pearler_.name = 'Pearler';
  pearler_.location = 'Sydney';
  pearler.company = pearler_;

  const imc = new CompanyAccount();
  imc.username = 'imc';
  imc.hash = Secrets.hash('imc');
  imc.verified = true;
  const imc_ = new Company();
  imc_.name = 'IMC';
  imc_.location = 'Sydney';
  imc.company = imc_;

  const sig = new CompanyAccount();
  sig.username = 'sig';
  sig.hash = Secrets.hash('sig');
  sig.verified = true;
  const sig_ = new Company();
  sig_.name = 'Sig';
  sig_.location = 'Sydney';
  sig.company = sig_;

  const citadel = new CompanyAccount();
  citadel.username = 'citadel';
  citadel.hash = Secrets.hash('citadel');
  citadel.verified = true;
  const citadel_ = new Company();
  citadel_.name = 'Citadel';
  citadel_.location = 'Sydney';
  citadel.company = citadel_;

  const palantir = new CompanyAccount();
  palantir.username = 'palantir';
  palantir.hash = Secrets.hash('palantir');
  palantir.verified = true;
  const palantir_ = new Company();
  palantir_.name = 'Palantir';
  palantir_.location = 'New York';
  palantir.company = palantir_;

  const canva_job1 = new Job();
  canva_job1.role = 'Backend Software Engineer (Java) - User Platform';
  canva_job1.description = `As a backend engineer, you will be collaborating to build up and scale the backbone of Canva’s User Management: the User Platform. The user platform team plays an essential role in keeping our services stable and scalable for our millions of daily users.
  You will be involved in designing, building, and maintaining new features to improve and extend the experience for Pro and Enterprise teams and organisations, namely User & Team Management, Single Sign On, Roles & Groups, Permissions and much more to come. This role entails constant collaboration with other teams across Canva, giving you a lot of exposure to what other teams are working on and giving you the opportunity to connect the dots.

  In User Platform, we break up existing services and build new ones from scratch to prepare our architecture for the future. We care about software design and its impact on the user. We constantly aim to get the most performance out of AWS resources, and along the way, we ship new features to improve the user experience for Enterprise and Education users.

  You will have the opportunity to work on some of the most crucial and high performance backend systems at Canva: the User Platform. How do we scale our backend systems to enable Canva to support 10x the amount of users we have today? This is our mission

  We decompose existing services, we build up new ones from scratch and care about software design. We constantly improve the way how we get the most performance out of AWS resources and along the way we ship new features to improve the user experience for Enterprise and Education customers and their advanced organisational needs.

  Join us on this exciting journey!`;
  canva_job1.applicationLink = 'https://www.lifeatcanva.com/en/jobs/c5f593b2-cc76-4e0b-bb06-f67eaa9160c6/backend-software-engineer-java-user-platform/';
  canva_job1.approved = true;
  canva_job1.hidden = false;
  canva_job1.company = canva_;
  canva_job1.mode = JobMode.Remote;
  canva_job1.studentDemographic = [StudentDemographic.FinalYear];
  canva_job1.jobType = JobType.Grad;
  canva_job1.workingRights = [WorkingRights.All];
  canva_job1.wamRequirements = WamRequirements.None;
  canva_job1.additionalInfo = '';
  canva_job1.isPaid = true;
  canva_job1.expiry = new Date('2023-12-12');

  const canva_job2 = new Job();
  canva_job2.role = 'Graduate Engineer 2024';
  canva_job2.description = `What you’d be doing in this role

  As Canva scales change continues to be part of our DNA. But we like to think that's all part of the fun. So this will give you the flavour of the type of things you'll be working on when you start, but this will likely evolve.

  At the moment, this role is focused on:

  • Collaborating with your assigned team to design, develop, test and maintain Canva projects.
  • Developing and maintaining documentation for software development processes, procedures, and guidelines.
  • Identifying and addressing performance bottlenecks while developing your craft with some of the most talented engineers.
  • Interacting with a wide variety of collaborators from both inside and outside your team to deliver high-quality work in a fast-paced environment.
  • Participating in meetings, hiring interviews, and code reviews. Performance debugging, benchmarking and building incredible things in general.`;
  canva_job2.applicationLink = 'https://www.lifeatcanva.com/en/jobs/cf7f9aa2-a455-4468-aae4-74dd9c0a576c/graduate-engineer-2024-backend-frontend-machine-learning-security-open-to-remote-across-anz/';
  canva_job2.approved = true;
  canva_job2.hidden = false;
  canva_job2.company = canva_;
  canva_job2.mode = JobMode.Remote;
  canva_job2.studentDemographic = [StudentDemographic.FinalYear];
  canva_job2.jobType = JobType.Grad;
  canva_job2.workingRights = [WorkingRights.All];
  canva_job2.wamRequirements = WamRequirements.None;
  canva_job2.additionalInfo = '';
  canva_job2.isPaid = true;
  canva_job2.expiry = new Date('2023-12-12');

  const canva_job3 = new Job();
  canva_job3.role = 'Graduate Data Scientist 2024';
  canva_job3.description = `What you’d be doing in this role

  As Canva scales change continues to be part of our DNA. But we like to think that's all part of the fun. So this will give you the flavour of the type of things you'll be working on when you start, but this will likely evolve.

  At the moment, this role is focused on:

  • Helping us understand both Canva and our customers - we want you to be creative and insightful, rather than just throwing the usual metrics at the wall to see what sticks.
  • Suggesting, setting up, and running interesting experiments that will actually move our metrics - when we push tests to 100% we want to actually see the bump in the relevant metrics.
  • Working alongside other data scientists, software engineers, and product managers to build up your mental model of how our product works and how people are using it.
  • Building and maintain data models in our data warehouse.
  • Analysing A/B tests to uncover the best way forward for our product.
  • Creating predictive models that can help us understand where we’re headed.`;
  canva_job3.applicationLink = 'https://www.lifeatcanva.com/en/jobs/825dd8c0-71cf-4cfd-a9ad-6a1c8fc58ae2/graduate-data-scientist-2024-open-to-remote-across-anz/';
  canva_job3.approved = true;
  canva_job3.hidden = false;
  canva_job3.company = canva_;
  canva_job3.mode = JobMode.Remote;
  canva_job3.studentDemographic = [StudentDemographic.FinalYear];
  canva_job3.jobType = JobType.Grad;
  canva_job3.workingRights = [WorkingRights.All];
  canva_job3.wamRequirements = WamRequirements.None;
  canva_job3.additionalInfo = '';
  canva_job3.isPaid = true;
  canva_job3.expiry = new Date('2023-12-12');

  canva.company.jobs = [canva_job1, canva_job2, canva_job3];
  await AppDataSource.manager.save(canva);

  const atlassian_job1 = new Job();
  atlassian_job1.role = 'Software Engineer Summer Intern';
  atlassian_job1.description = "Join Atlassian as an intern and spend your summer with them having a direct impact on how millions of users collaborate and use software. The most amazing thinkers—like NASA rocket scientists and Tesla engineers—are coming to them for solutions. They’re in the business of developing software to help teams everywhere get amazing ideas on the ground and into the world. Sound like an exciting place to start your career? Here you'll be encouraged to use your imagination and try new things. You'll be guided by their core values, and you'll be supported by some of the best minds in tech.";
  atlassian_job1.applicationLink = 'https://www.atlassian.com/company/careers';
  atlassian_job1.approved = true;
  atlassian_job1.hidden = false;
  atlassian_job1.company = atlassian_;
  atlassian_job1.mode = JobMode.Hybrid;
  atlassian_job1.studentDemographic = [StudentDemographic.Penultimate];
  atlassian_job1.jobType = JobType.Intern;
  atlassian_job1.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes];
  atlassian_job1.wamRequirements = WamRequirements.None;
  atlassian_job1.additionalInfo = '';
  atlassian_job1.isPaid = true;
  atlassian_job1.expiry = new Date('2023-12-12');

  atlassian.company.jobs = [atlassian_job1];
  await AppDataSource.manager.save(atlassian);

  const imc_job1 = new Job();
  imc_job1.role = 'Software Engineer Intern';
  imc_job1.description = `As a software engineer intern at IMC, you will:

  Explore our trading and technology landscape during a week of classroom-based training
  Enhance your knowledge of algorithm complexity, data structures, and writing fluent code
  Hone your skills by taking part in peer reviews and learning from a dedicated mentor
  Experience IMC’s unique culture, joining regular social events and participating in charity work
  Benefit from a highly competitive compensation package, with accommodation included
  Build a valuable network of IMC engineers and traders`;
  imc_job1.applicationLink = 'https://careers.imc.com/ap/en/c/internships-jobs';
  imc_job1.approved = true;
  imc_job1.hidden = false;
  imc_job1.company = imc_;
  imc_job1.mode = JobMode.Onsite;
  imc_job1.studentDemographic = [StudentDemographic.Penultimate];
  imc_job1.jobType = JobType.Intern;
  imc_job1.workingRights = [WorkingRights.All];
  imc_job1.wamRequirements = WamRequirements.None;
  imc_job1.additionalInfo = '';
  imc_job1.isPaid = true;
  imc_job1.expiry = new Date('2023-12-12');

  const imc_job2 = new Job();
  imc_job2.role = 'Trader Intern';
  imc_job2.description = `WHAT YOU’LL DO:

  From day one, you are immersed in real projects, complex problem solving and opportunities to learn from some of the industry’s strongest Traders and Engineers.

  See what it is like to be a Trader at IMC; develop your trading skills and strategies with our in-house trading simulation.

  Learn about the trading industry and market-making.

  Work collaboratively in an environment where creativity, teamwork and innovation are recognised and rewarded.

  Be supported by a mentor who will oversee your progress and professional development.

  Have the opportunity to secure a full-time role with IMC once you graduate`;
  imc_job2.applicationLink = 'https://careers.imc.com/ap/en/c/internships-jobs';
  imc_job2.approved = true;
  imc_job2.hidden = false;
  imc_job2.company = imc_;
  imc_job2.mode = JobMode.Onsite;
  imc_job2.studentDemographic = [StudentDemographic.Penultimate];
  imc_job2.jobType = JobType.Intern;
  imc_job2.workingRights = [WorkingRights.All];
  imc_job2.wamRequirements = WamRequirements.None;
  imc_job2.additionalInfo = '';
  imc_job2.isPaid = true;
  imc_job2.expiry = new Date('2023-12-12');

  imc.company.jobs = [imc_job1, imc_job2];
  await AppDataSource.manager.save(imc);

  const sig_job1 = new Job();
  sig_job1.role = 'PhD Quantitative Research Internship';
  sig_job1.description = `Overview
  Are you passionate about research and solving the unsolvable?
  Have you considered your research options outside of academia?


  Explore industry research options at SIG. We’re on the lookout for passionate PhD researchers who are interested in using their rigorous academic research approach to solve challenging problems with real word application, within fast paced financial markets.


  What you’ll do

  • Over the 10-week program, you’ll apply probability, statistics and mathematical creativity to several impactful trading projects.
  • Collaborate with researchers, traders, and technologists to help transform our quantitative modeling into trading opportunities and strategies.`;
  sig_job1.applicationLink = 'https://careers.sig.com/sig-sydney-jobs/?from=10&s=1&rk=l-sig-sydney-jobs';
  sig_job1.approved = true;
  sig_job1.hidden = false;
  sig_job1.company = sig_;
  sig_job1.mode = JobMode.Onsite;
  sig_job1.studentDemographic = [StudentDemographic.Penultimate];
  sig_job1.jobType = JobType.Intern;
  sig_job1.workingRights = [WorkingRights.AusCtz, WorkingRights.AusPermRes];
  sig_job1.wamRequirements = WamRequirements.None;
  sig_job1.additionalInfo = '';
  sig_job1.isPaid = true;
  sig_job1.expiry = new Date('2023-12-12');

  sig.company.jobs = [sig_job1];
  await AppDataSource.manager.save(sig);

  const optiver_job1 = new Job();
  optiver_job1.role = 'Software Engineer Internship';
  optiver_job1.description = `What you’ll do

  No previous experience in trading or financial markets?

  You bring the passion and we'll have the training to support you along the way.

  As our Software Engineer Intern, you'll take ownership of critical projects right from the start. Whether it's developing ultra-low-latency exchange protocol encoders and decoders, or fine-tuning our automated trading strategies and pricing models, your goal is to find the simplest and cleanest solution to the problem at hand.

  You’ll experience the excitement of a fast-paced development cycle – owning a tight feedback loop, testing and shipping your code to production. You could be working on a change to a trading system in the morning and see it running live in the afternoon. Our collaborative culture means you’ll work closely with Traders and other Engineers to identify and solve problems that make a tangible impact on the business.

  By the end of the internship, you’ll have learnt the ins-and-outs of our trading systems and the engineering concepts that make them successful.`;
  optiver_job1.applicationLink = 'https://optiver.com/working-at-optiver/career-opportunities/?numberposts=10&paged=1&tax_query[office]=122';
  optiver_job1.approved = true;
  optiver_job1.hidden = false;
  optiver_job1.company = optiver_;
  optiver_job1.mode = JobMode.Onsite;
  optiver_job1.studentDemographic = [StudentDemographic.All];
  optiver_job1.jobType = JobType.Intern;
  optiver_job1.workingRights = [WorkingRights.All];
  optiver_job1.wamRequirements = WamRequirements.None;
  optiver_job1.additionalInfo = '';
  optiver_job1.isPaid = true;
  optiver_job1.expiry = new Date('2023-12-12');

  const optiver_job2 = new Job();
  optiver_job2.role = 'FPGA Engineer Internship';
  optiver_job2.description = `What you’ll do:

  Get ready for ten weeks immersed in the fast-paced, dynamic world of market making.

  As a Hardware Engineer Intern, you'll own projects that directly impact Optiver's world-class trading systems. You’ll get tight feedback loops and ship your code to production within weeks alongside our senior Engineers and Traders. You’ll work side-by-side with an assigned mentor to build latency-critical applications, parallel systems and networking interfaces. From day one, you’ll tackle real issues that will test your critical thinking and problem-solving acumen, and each day will bring new challenges that require fresh perspectives. It's an unrivalled opportunity to accelerate your knowledge and make your mark on Optiver's business.

  You will also have the chance to join industry lectures to learn about trading and our other departments to gain a complete understanding of Optiver and our business. Don't worry, previous knowledge of the financial industry is not required. You’ll take part in a training program where, through a combination of theoretical knowledge and hands-on practical experience, you’ll learn everything you need to know.`;
  optiver_job2.applicationLink = 'https://optiver.com/working-at-optiver/career-opportunities/?numberposts=10&paged=1&tax_query[office]=122';
  optiver_job2.approved = true;
  optiver_job2.hidden = false;
  optiver_job2.company = optiver_;
  optiver_job2.mode = JobMode.Onsite;
  optiver_job2.studentDemographic = [StudentDemographic.All];
  optiver_job2.jobType = JobType.Intern;
  optiver_job2.workingRights = [WorkingRights.All];
  optiver_job2.wamRequirements = WamRequirements.None;
  optiver_job2.additionalInfo = '';
  optiver_job2.isPaid = true;
  optiver_job2.expiry = new Date('2023-12-12');

  const optiver_job3 = new Job();
  optiver_job3.role = 'Quantitative Trading Internship';
  optiver_job3.description = `WHAT YOU’LL DO:

  As Optiver’s Quantitative Trading Intern, you’ll deep-dive into understanding the fundamentals of trading, from theory to financial markets, strategies and cutting-edge technology. But you won’t only receive our intensive in-house training – you’ll put your knowledge into practice through simulated trading. Requiring quick thinking, a critical mindset and bold action, our internship programme is as close as you can get to real trading experience. What’s more: the projects you fully own and develop will be implemented directly into our trading desks, meaning you’ll contribute to our ever evolving strategies. Get ready to test your limits and accelerate your growth in a truly fascinating, high-performance environment. `;
  optiver_job3.applicationLink = 'https://optiver.com/working-at-optiver/career-opportunities/?numberposts=10&paged=1&tax_query[office]=122';
  optiver_job3.approved = true;
  optiver_job3.hidden = false;
  optiver_job3.company = optiver_;
  optiver_job3.mode = JobMode.Onsite;
  optiver_job3.studentDemographic = [StudentDemographic.All];
  optiver_job3.jobType = JobType.Intern;
  optiver_job3.workingRights = [WorkingRights.All];
  optiver_job3.wamRequirements = WamRequirements.None;
  optiver_job3.additionalInfo = '';
  optiver_job3.isPaid = true;
  optiver_job3.expiry = new Date('2023-12-12');

  optiver.company.jobs = [optiver_job1, optiver_job2, optiver_job3];
  await AppDataSource.manager.save(optiver);

  const citadel_job1 = new Job();
  citadel_job1.role = 'Quantitative Research - Intern';
  citadel_job1.description = `Job Description
  Our mission is to be the most successful investment team in the world. Quantitative Researchers play a key role in this mission by developing next-generation models and trading approaches for a range of investment strategies. You’ll get to challenge the impossible in quantitative research by applying sophisticated and complex statistical techniques to financial markets, some of the most complex data sets in the world.
  As an intern, you’ll get to challenge the impossible in research through an 11 week program that will allow you to collaborate and connect with senior team members. In addition, you’ll get the opportunity to network and socialize with peers throughout the internship.
  `;
  citadel_job1.applicationLink = 'https://www.citadelsecurities.com/careers/details/quantitative-research-intern-australia/';
  citadel_job1.approved = true;
  citadel_job1.hidden = false;
  citadel_job1.company = citadel_;
  citadel_job1.mode = JobMode.Onsite;
  citadel_job1.studentDemographic = [StudentDemographic.All];
  citadel_job1.jobType = JobType.Intern;
  citadel_job1.workingRights = [WorkingRights.All];
  citadel_job1.wamRequirements = WamRequirements.None;
  citadel_job1.additionalInfo = '';
  citadel_job1.isPaid = true;
  citadel_job1.expiry = new Date('2023-12-12');

  const citadel_job2 = new Job();
  citadel_job2.role = 'Software Engineer - Intern';
  citadel_job2.description = `Job Description
  Software Engineers at Citadel Securities create next generation software solutions that help produce systems that power our investment research, trading, risk management, and funding & settlement systems. Software Engineers continually improve the efficiency and effectiveness of our investment process and reduce operational risk.  Software Engineers partner closely with business leaders to develop and deliver software solutions that drive meaningful business outcomes. We build a range of critical solutions from pre-trade research platforms to trading systems to post-trade clearing and settlement services. These solutions include high availability, high throughput systems scaling to millions of transactions per second.
  As an intern, you’ll get to challenge the impossible in technology through program that will allow you to collaborate and connect with senior team members.
  `;
  citadel_job2.applicationLink = 'https://www.citadelsecurities.com/careers/details/software-engineer-intern-australia/';
  citadel_job2.approved = true;
  citadel_job2.hidden = false;
  citadel_job2.company = citadel_;
  citadel_job2.mode = JobMode.Onsite;
  citadel_job2.studentDemographic = [StudentDemographic.All];
  citadel_job2.jobType = JobType.Intern;
  citadel_job2.workingRights = [WorkingRights.All];
  citadel_job2.wamRequirements = WamRequirements.None;
  citadel_job2.additionalInfo = '';
  citadel_job2.isPaid = true;
  citadel_job2.expiry = new Date('2023-12-12');

  const citadel_job3 = new Job();
  citadel_job3.role = 'Trader - Intern';
  citadel_job3.description = `Job Description
  At Citadel Securities, our traders make complex risk decisions and execute trades at scale, in real-time. As a markets and trading expert, you’ll use predictive analytics and advanced technology to monitor risk, respond to market signals and execute trading strategies across Options, ETFs, Equities, Fixed Income, Commodities and Currencies.
  As an intern, you’ll get to challenge the impossible in markets and trading through a program that will allow you to collaborate and connect with a global team. In addition, you’ll get the opportunity to network and socialize with peers throughout the internship.`;
  citadel_job3.applicationLink = 'https://www.citadelsecurities.com/careers/details/trader-intern-australia/';
  citadel_job3.approved = true;
  citadel_job3.hidden = false;
  citadel_job3.company = citadel_;
  citadel_job3.mode = JobMode.Onsite;
  citadel_job3.studentDemographic = [StudentDemographic.All];
  citadel_job3.jobType = JobType.Intern;
  citadel_job3.workingRights = [WorkingRights.All];
  citadel_job3.wamRequirements = WamRequirements.None;
  citadel_job3.additionalInfo = '';
  citadel_job3.isPaid = true;
  citadel_job3.expiry = new Date('2023-12-12');

  citadel.company.jobs = [citadel_job1, citadel_job2, citadel_job3];
  await AppDataSource.manager.save(citadel);

  const palantir_job1 = new Job();
  palantir_job1.role = 'Software Engineer Internship';
  palantir_job1.description = `Core Responsibilities

  As a Software Engineer, you are involved throughout the product lifecycle - from idea generation, design, and prototyping to execution and shipping while also being paired with a mentor dedicated to your growth and success. You'll collaborate closely with technical and non-technical counterparts to understand our customers' problems and build products that tackle them. One of the most effective ways to understand what our users need is to meet them. You may receive an opportunity to tour the assembly line at an auto-manufacturer or join a counter-terror analyst at their desk to really understand their mission and difficulties.`;
  palantir_job1.applicationLink = 'https://jobs.lever.co/palantir/7d69cf8a-06fd-4f05-bd84-27149db29c4d';
  palantir_job1.approved = true;
  palantir_job1.hidden = false;
  palantir_job1.company = palantir_;
  palantir_job1.mode = JobMode.Onsite;
  palantir_job1.studentDemographic = [StudentDemographic.Penultimate];
  palantir_job1.jobType = JobType.Intern;
  palantir_job1.workingRights = [WorkingRights.All];
  palantir_job1.wamRequirements = WamRequirements.None;
  palantir_job1.additionalInfo = '';
  palantir_job1.isPaid = true;
  palantir_job1.expiry = new Date('2023-12-12');

  palantir.company.jobs = [palantir_job1];
  await AppDataSource.manager.save(palantir);

  const amazon_job1 = new Job();
  amazon_job1.role = 'Software Dev Engineer Intern';
  amazon_job1.description = `Come and build production software as an Amazon Software Development Engineer Intern. We are looking for passionate developers who love solving challenging problems, learning on the job, and working in a team to get stuff done.
  You'll work on all phases of the software lifecycle alongside a diverse team. Your fresh perspective will inform innovative solutions to problems customers' face every day.
  Amazon offers a unique work environment. You will be able to work on the A to Z of problems, at scale, for real customers.
  Get your career off to a flying start! Solve challenging problems. Build software that helps customers daily. And have a ton of fun doing all that. We want to hear from you today!

  Responsibilities :
  · Ability to design and code right solutions starting with broadly defined problems.
  · Drive best practices and engineering excellence.
  · Work with other team members to develop the architecture and design of new and current systems.
  · Work in an agile environment to deliver high quality software.`;
  amazon_job1.applicationLink = 'https://amazon.jobs/en-gb/jobs/2413439/2023-software-dev-engineer-intern-syd-aws';
  amazon_job1.approved = true;
  amazon_job1.hidden = false;
  amazon_job1.company = amazon_;
  amazon_job1.mode = JobMode.Hybrid;
  amazon_job1.studentDemographic = [StudentDemographic.Penultimate];
  amazon_job1.jobType = JobType.Intern;
  amazon_job1.workingRights = [WorkingRights.All];
  amazon_job1.wamRequirements = WamRequirements.None;
  amazon_job1.additionalInfo = '';
  amazon_job1.isPaid = true;
  amazon_job1.expiry = new Date('2023-12-12');

  const amazon_job2 = new Job();
  amazon_job2.role = 'System Development Engineer Intern';
  amazon_job2.description = `DESCRIPTION
  Do you love automating and streamlining manual processes? Do you have a passion for making things easier, better, faster and more efficient? We may have the right role for you.

  Systems Development interns work with technical leaders to refine technical direction, and then follow through with detailed review, designs, and truly innovative code. They are builders who are experienced in at least one scripting language, are familiar with networking concepts, and familiar with working in a Linux environment. They are the industry’s brightest engineers who innovate every day on behalf of our customers.
  If this sounds exciting to you - come build the future with us!`;
  amazon_job2.applicationLink = 'https://amazon.jobs/en-gb/jobs/2407108/2023-system-development-engineer-intern';
  amazon_job2.approved = true;
  amazon_job2.hidden = false;
  amazon_job2.company = amazon_;
  amazon_job2.mode = JobMode.Hybrid;
  amazon_job2.studentDemographic = [StudentDemographic.Penultimate];
  amazon_job2.jobType = JobType.Intern;
  amazon_job2.workingRights = [WorkingRights.All];
  amazon_job2.wamRequirements = WamRequirements.None;
  amazon_job2.additionalInfo = '';
  amazon_job2.isPaid = true;
  amazon_job2.expiry = new Date('2023-12-12');

  amazon.company.jobs = [amazon_job1, amazon_job2];
  AppDataSource.manager.save(amazon);

  Logger.Info(LM, 'FINISHED SEEDING');
}
