import { Request, Response, NextFunction } from 'express';

import { Client } from 'ldapts';
import { AppDataSource } from './index';

import { AdminAccount } from './entity/admin_account';
import { CompanyAccount } from './entity/company_account';
import { Student } from './entity/student';
import Helpers, { IResponseWithStatus } from './helpers';
import JWT from './jwt';
import Logger from './logging';
import Secrets from './secrets';

// auth token data structures
interface IToken {
  id: number;
  type: AccountType;
  lastRequestTimestamp: number;
  ipAddress: string;
}

// differentiating between account types
enum AccountType {
  Admin,
  Student,
  Company,
}

export { IToken, AccountType };

export default class Auth {
  // Student-based authentication functions
  public static async AuthenticateStudent(
    this: void,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        const msg = req.body;
        Helpers.requireParameters(msg.zID);
        Helpers.requireParameters(msg.password);
        const result = await Auth.authenticateStudent(msg.zID, msg.password);
        if (result === true) {
          Logger.Info(`Successfully authenticated STUDENT=${msg.zID}`);
          // successful login
          const rawToken: IToken = {
            id: msg.zID,
            type: AccountType.Student,
            lastRequestTimestamp: Date.now(),
            ipAddress: req.ip,
          };

          const token: JWT = JWT.create(rawToken);

          // find whether the student has logged on here before
          const studentQuery = await AppDataSource.getRepository(Student)
            .createQueryBuilder()
            .where('Student.zID = :zID', { zID: msg.zID })
            .getOne();

          if (studentQuery === null) {
            // never logged on here before
            const student: Student = new Student();
            student.zID = msg.zID;
            student.latestValidToken = token as string;
            await AppDataSource.manager.save(student);
            Logger.Info(`Created student record for STUDENT=${msg.zID}`);
          } else {
            await AppDataSource.createQueryBuilder()
              .update(Student)
              .set({ latestValidToken: token as string })
              .where('id = :id', { id: studentQuery.id })
              .execute();
          }

          return {
            status: 200,
            msg: {
              token,
            },
          } as IResponseWithStatus;
        }
        Logger.Info(`Failed to authenticate STUDENT=${msg.zID}`);
        throw new Error('Invalid credentials');
      },
      () => ({ status: 400, msg: undefined } as IResponseWithStatus),
      next,
    );
  }

  // Company-based authentication functions
  public static async AuthenticateCompany(
    this: void,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        const msg = { username: req.body.username, password: req.body.password };
        Helpers.requireParameters(msg.username);
        Helpers.requireParameters(msg.password);
        // check if account exists
        const companyQuery = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(CompanyAccount)
            .createQueryBuilder()
            .where('CompanyAccount.username = :username', { username: msg.username })
            .getOne(),
          `Couldn't find company with username: ${msg.username}`,
        );
        try {
          if (
            !Secrets.compareHash(companyQuery.hash.valueOf(), Secrets.hash(msg.password).valueOf())
          ) {
            Logger.Info(
              `Failed to authenticate COMPANY=${msg.username} due to INVALID CREDENTIALS`,
            );
            throw new Error('Invalid credentials');
          }
          Logger.Info(`Successfully authenticated COMPANY=${msg.username}`);
          const rawToken: IToken = {
            id: companyQuery.id,
            type: AccountType.Company,
            lastRequestTimestamp: Date.now(),
            ipAddress: req.ip,
          };
          const token: JWT = JWT.create(rawToken);
          await AppDataSource.createQueryBuilder()
            .update(CompanyAccount)
            .set({ latestValidToken: token as string })
            .where('id = :id', { id: companyQuery.id })
            .execute();
          // credentials match, so grant them a token
          return {
            status: 200,
            msg: {
              token,
            },
          } as IResponseWithStatus;
        } catch (error) {
          return { status: 401, msg: undefined } as IResponseWithStatus;
        }
      },
      () => ({ status: 400, msg: undefined } as IResponseWithStatus),
      next,
    );
  }

  // admin-based authentication functions
  public static async AuthenticateAdmin(
    this: void,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    await Helpers.catchAndLogError(
      res,
      async () => {
        const msg = { username: req.body.username, password: req.body.password };
        Helpers.requireParameters(msg.username);
        Helpers.requireParameters(msg.password);
        // check if account exists
        const adminQuery = await Helpers.doSuccessfullyOrFail(
          async () => AppDataSource.getRepository(AdminAccount)
            .createQueryBuilder()
            .where('AdminAccount.username = :username', { username: msg.username })
            .getOne(),
          `Couldn't find admin account with username: ${msg.username}`,
        );
        try {
          if (
            !Secrets.compareHash(adminQuery.hash.valueOf(), Secrets.hash(msg.password).valueOf())
          ) {
            Logger.Info(`Failed to authenticate ADMIN=${msg.username} due to invalid credentials`);
            throw new Error('Invalid credentials');
          }
          Logger.Info(`Successfully authenticated ADMIN=${msg.username}`);
          // credentials match, so grant them a token
          const rawToken: IToken = {
            id: adminQuery.id,
            type: AccountType.Admin,
            lastRequestTimestamp: Date.now(),
            ipAddress: req.ip,
          };
          const token: JWT = JWT.create(rawToken);
          await AppDataSource.createQueryBuilder()
            .update(AdminAccount)
            .set({ latestValidToken: token as string })
            .where('id = :id', { id: adminQuery.id })
            .execute();
          return {
            status: 200,
            msg: {
              token,
            },
          } as IResponseWithStatus;
        } catch (error) {
          return { status: 401, msg: undefined } as IResponseWithStatus;
        }
      },
      () => ({ status: 400, msg: undefined } as IResponseWithStatus),
      next,
    );
  }

  // private functions to assist previous authentication functions
  private static async authenticateStudent(zID: string, password: string): Promise<boolean> {
    if (process.env.NODE_ENV !== 'development') {
      if (/^[a-zA-Z0-9]+$/.test(zID)) {
        // check if it matches the zID format, throw otherwise.
        Helpers.doesMatchZidFormat(zID);

        const client = new Client({
          url: 'ldaps://ad.unsw.edu.au',
          // tlsOptions: {
          //   minVersion: 'TLSv1.2',
          // },
        });
        const result = await client.bind(`${zID}@ad.unsw.edu.au`, password);
        Logger.Info(`Authentication state for STUDENT=${zID} IS=${result}`);
        return true;
      }
      // if unexpected characters are found, immediately reject
      Logger.Info(`Failed to login STUDENT=${zID} due to INVALID FORMAT`);
      return false;
    }
    return true;
  }
}
