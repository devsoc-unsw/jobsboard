import { Request, Response, NextFunction } from "express";
import {
  Connection,
  getConnection,
  getRepository,
} from "typeorm";
import { AdminAccount } from "./entity/admin_account";
import { Company } from "./entity/company";
import { CompanyAccount } from "./entity/company_account";
import { Job } from "./entity/job";
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
      if (Auth.authenticateStudent(msg.zID, msg.password)) {
        // successful login
        const token: IToken = {
          id: msg.zID,
          type: AccountType.Student,
          lastRequestTimestamp: Date.now(),
          ipAddress: req.ip,
        };
        return {
          status: 200,
          msg: { 
            token: JWT.create(token) 
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
        const token: IToken = {
          id: companyQuery.id,
          type: AccountType.Company,
          lastRequestTimestamp: Date.now(),
          ipAddress: req.ip,
        };
        // credentials match, so grant them a token
        return {
          status: 200,
          msg: {
            token: JWT.create(token)
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
        const token: IToken = {
          id: adminQuery.id,
          type: AccountType.Admin,
          lastRequestTimestamp: Date.now(),
          ipAddress: req.ip,
        };
        return {
          status: 200,
          msg: {
            token: JWT.create(token)
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
  private static authenticateStudent(zID: string, password: string): boolean {
    // TODO: Implement
    return true;
  }
}
