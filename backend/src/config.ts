import fs from 'fs';
import { DataSource } from 'typeorm';
// import dotenv from 'dotenv';
import environment from './environment';
import Logger from './logging';

// custom entities
import AdminAccount from './entity/admin_account';
import Company from './entity/company';
import CompanyAccount from './entity/company_account';
import Job from './entity/job';
import Student from './entity/student';
import MailRequest from './entity/mail_request';
import Logs from './entity/logs';
import Statistics from './entity/statistics';

// dotenv.config();

export const activeEntities = [
  Company,
  CompanyAccount,
  Job,
  Student,
  AdminAccount,
  MailRequest,
  Logs,
  Statistics,
];

console.log(environment.data());

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: environment.data().DB_HOST,
  port: Number(environment.data().DB_PORT),
  username: environment.data().DB_USER,
  password: environment.data().DB_PASSWORD,
  database: environment.data().DB_NAME,
  synchronize: true,
  logging: false,
  entities: activeEntities,
  migrations: [],
  subscribers: [],
});

export class Config {
  public static getSecret(name: string) {
    if (!fs.existsSync(`/run/secrets/${name}`)) {
      Logger.Error(`Unable to find secret "${name}".`);
    }
    return fs.readFileSync(`/run/secrets/${name}`, 'utf-8');
  }
}
