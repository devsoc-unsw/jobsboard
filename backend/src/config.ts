import fs from 'fs';
import { DataSource } from 'typeorm';

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
import dotenv from 'dotenv';

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

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
