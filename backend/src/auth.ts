import { Response, NextFunction } from 'express';
import { AppDataSource } from './config';
import AdminAccount from './entity/admin_account';
import CompanyAccount from './entity/company_account';
import EStudent from './entity/student';
import Helpers, { IResponseWithStatus } from './helpers';
import JWT from './jwt';
import Logger from './logging';
import Secrets from './secrets';
import { AuthRequest } from './interfaces/interfaces';

// auth token data structures
interface IToken {
  id: string;
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
    req: AuthRequest,
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

          const rawToken: IToken = {
            id: msg.zID,
            type: AccountType.Student,
            lastRequestTimestamp: Date.now(),
            ipAddress: req.ip,
          };

          const token: JWT = JWT.create(rawToken);

          // find whether the student has logged on here before
          const studentQuery = await AppDataSource.getRepository(EStudent)
            .createQueryBuilder()
            .where('Student.zID = :zID', { zID: msg.zID })
            .getOne();

          if (studentQuery === null) {
            // never logged on here before
            const student: EStudent = new EStudent();
            student.zID = msg.zID;
            student.latestValidToken = token as string;
            await AppDataSource.manager.save(student);
            Logger.Info(`Created student record for STUDENT=${msg.zID}`);
          } else {
            await AppDataSource.createQueryBuilder()
              .update(EStudent)
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
    req: AuthRequest,
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
            id: companyQuery.id.toString(),
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
    req: AuthRequest,
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
        const adminQuery = await AppDataSource.getRepository(AdminAccount)
          .createQueryBuilder()
          .where('AdminAccount.username = :username', { username: msg.username })
          .getOne();

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
            id: adminQuery.id.toString(),
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

        const payload = { zid: zID, zpass: password };
        const verifyResponse = await fetch('https://verify.csesoc.unsw.edu.au/v1', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (verifyResponse.ok) {
          Logger.Info(`STUDENT=${zID} is logged in`);
          return true;
        }

        if (verifyResponse.status === 401) {
          Logger.Info(`Failed to login STUDENT=${zID} due to INCORRECT PASSWORD`);
        } else {
          Logger.Info(`Failed to login STUDENT=${zID} due to ERROR CODE ${verifyResponse.status}`);
        }
        return false;
      }
      // if unexpected characters are found, immediately reject
      Logger.Info(`Failed to login STUDENT=${zID} due to INVALID FORMAT`);
      return false;
    }
    return true;
  }
}
