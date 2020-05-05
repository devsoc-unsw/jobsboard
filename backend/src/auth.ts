import { Request, Response, NextFunction } from "express";
import {
  Connection,
  getConnection,
  getRepository,
} from "typeorm";
import { Client } from "ldapts";
import assert from "assert";
import { AdminAccount } from "./entity/admin_account";
import { Company } from "./entity/company";
import { CompanyAccount } from "./entity/company_account";
import { Job } from "./entity/job";
import { Student } from "./entity/student";
import Helpers, { IResponseWithStatus } from "./helpers";
import JWT from "./jwt";
import Logger from "./logging";
import Secrets from "./secrets";

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
  public static async AuthenticateStudent(req: Request, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      const msg = req.body;
      Helpers.requireParameters(msg.zID);
      Helpers.requireParameters(msg.password);
      const result = await Auth.authenticateStudent(msg.zID, msg.password)
      if (result === true) {
        // successful login
        const rawToken: IToken = {
          id: msg.zID,
          type: AccountType.Student,
          lastRequestTimestamp: Date.now(),
          ipAddress: req.ip,
        };

        const token: JWT = JWT.create(rawToken);

        const student: Student = new Student()
        student.zID = msg.zID;
        student.latestValidToken = token as string,

        await getConnection().createQueryBuilder()
            .insert()
            .into(Student)
            .values(student)
            .onConflict(`("zID") DO UPDATE SET "latestValidToken" = :latestValidToken`)
            .setParameter("latestValidToken", token)
            .execute();

        return {
          status: 200,
          msg: { 
            token: token,
          } 
        } as IResponseWithStatus;
      } else {
        throw new Error("Invalid credentials");
      }
    }, () => {
      return { status: 400, msg: undefined } as IResponseWithStatus;
    }, next);
  }

  // Company-based authentication functions
  public static async AuthenticateCompany(req: Request, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      const msg = { username: req.body.username, password: req.body.password };
      Helpers.requireParameters(msg.username);
      Helpers.requireParameters(msg.password);
      // check if account exists
      const companyQuery = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(CompanyAccount)
        .createQueryBuilder()
        .where("CompanyAccount.username = :username", { username: msg.username })
        .getOne();
      }, `Couldn't find company with username: ${msg.username}`);
      try {
        if (!Secrets.compareHash(companyQuery.hash.valueOf(), Secrets.hash(msg.password).valueOf())) {
          throw new Error("Invalid credentials");
        }
        const rawToken: IToken = {
          id: companyQuery.id,
          type: AccountType.Company,
          lastRequestTimestamp: Date.now(),
          ipAddress: req.ip,
        };
        const token: JWT = JWT.create(rawToken);
        await getConnection().createQueryBuilder()
          .update(CompanyAccount)
          .set({ latestValidToken: token as string})
          .where("id = :id", { id: companyQuery.id })
          .execute();
        // credentials match, so grant them a token
        return {
          status: 200,
          msg: {
            token: token,
          }
        } as IResponseWithStatus;
      } catch (error) {
        return { status: 401, msg: undefined } as IResponseWithStatus;
      }
    }, () => {
      return { status: 400, msg: undefined } as IResponseWithStatus;
    }, next);
  }

  // admin-based authentication functions
  public static async AuthenticateAdmin(req: Request, res: Response, next: NextFunction) {
    Helpers.catchAndLogError(res, async () => {
      const msg = { username: req.body.username, password: req.body.password };
      Helpers.requireParameters(msg.username);
      Helpers.requireParameters(msg.password);
      // check if account exists
      const adminQuery = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(AdminAccount)
        .createQueryBuilder()
        .where("AdminAccount.username = :username", { username: msg.username })
        .getOne();
      }, `Couldn't find admin account with username: ${msg.username}`);
      try {
        if (!Secrets.compareHash(adminQuery.hash.valueOf(), Secrets.hash(msg.password).valueOf())) {
          throw new Error("Invalid credentials");
        }
        // credentials match, so grant them a token
        const rawToken: IToken = {
          id: adminQuery.id,
          type: AccountType.Admin,
          lastRequestTimestamp: Date.now(),
          ipAddress: req.ip,
        };
        const token: JWT = JWT.create(rawToken);
        await getConnection().createQueryBuilder()
          .update(AdminAccount)
          .set({ latestValidToken: token as string})
          .where("id = :id", { id: adminQuery.id })
          .execute();
        return {
          status: 200,
          msg: {
            token: token,
          }
        } as IResponseWithStatus;
      } catch (error) {
        return { status: 401, msg: undefined } as IResponseWithStatus;
      }
    }, () => {
      return { status: 400, msg: undefined } as IResponseWithStatus;
    }, next);
  }

  // private functions to assist previous authentication functions
  private static async authenticateStudent(zID: string, password: string): Promise<boolean> {
    // TODO: Implement
    if (process.env.NODE_ENV !== "development") {
      if (/^[a-zA-Z0-9]+$/.test(zID)) {
        const client = new Client({
          url: 'ldaps://ad.unsw.edu.au',
          // tlsOptions: {
          //   minVersion: 'TLSv1.2',
          // },
        });
        const result = await client.bind(`${zID}@ad.unsw.edu.au`, password);
        Logger.Info(`RESULT FOR ${zID} IS: ${result}`);
        return true;
      } else {
        // if unexpected characters are found, immediately reject
        return false;
      }
    } else {
      return true;
    }
  }
}
