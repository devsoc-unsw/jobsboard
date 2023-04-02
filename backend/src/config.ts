import fs from 'fs';
import { DataSource } from 'typeorm';

import Logger from './logging';
import ev from './environment';

// custom entities
import AdminAccount from './entity/admin_account';
import Company from './entity/company';
import CompanyAccount from './entity/company_account';
import Job from './entity/job';
import Student from './entity/student';
import MailRequest from './entity/mail_request';
import Logs from './entity/logs';
import Statistics from './entity/statistics';

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
  host: ev.data().DB_HOST,
  port: Number(ev.data().DB_PORT),
  username: ev.data().DB_USER,
  password: ev.data().DB_PASSWORD,
  database: ev.data().DB_NAME,
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
