import fs from 'fs';
import { DataSource } from 'typeorm';

import { Logger, LogModule } from './logging';
import { env } from './environment';

// custom entities
import AdminAccount from './entity/admin_account';
import Company from './entity/company';
import CompanyAccount from './entity/company_account';
import Job from './entity/job';
import Student from './entity/student';
import MailRequest from './entity/mail_request';
import Logs from './entity/logs';
import Statistics from './entity/statistics';

const LM = new LogModule('CONFIG');

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

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: activeEntities,
  migrations: [],
  subscribers: [],
});

export class Config {
  public static getSecret(name: string) {
    if (!fs.existsSync(`/run/secrets/${name}`)) {
      Logger.Error(LM, `Unable to find secret "${name}".`);
    }
    return fs.readFileSync(`/run/secrets/${name}`, 'utf-8');
  }
}
