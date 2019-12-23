import { Request, Response } from "express";
import {
  Connection,
  getConnection,
  getRepository,
} from "typeorm";
import { AdminAccount } from "./entity/admin_account";
import { Company } from "./entity/company";
import { CompanyAccount } from "./entity/company_account";
import { Job } from "./entity/job";
import Helpers from "./helpers";
import JWT from "./jwt";
import Logger from "./logging";
import Secrets from "./secrets";

// auth token data structures
interface IToken {
  id: number;
  type: AccountType;
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
  public static async AuthenticateStudent(req: Request, res: Response) {
    try {
      const msg = req.body;
      Helpers.requireParameters(msg.zID);
      Helpers.requireParameters(msg.password);
      if (Auth.authenticateStudent(msg.zID, msg.password)) {
        // successful login
        const token: IToken = {
          id: msg.zID,
          type: AccountType.Student,
        };
        res.send({ token: JWT.create(token) });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      res.sendStatus(400);
    }
  }

  // Company-based authentication functions
  public static async AuthenticateCompany(req: Request, res: Response) {
    try {
      const msg = { username: req.body.username, password: req.body.password };
      Helpers.requireParameters(msg.username);
      Helpers.requireParameters(msg.password);
      // check if account exists
      const companyQuery = await getRepository(CompanyAccount).findOneOrFail({
        username: msg.username,
      }).catch((error) => { throw new Error(error); });
      try {
        if (!Secrets.compareHash(companyQuery.hash.valueOf(), Secrets.hash(msg.password).valueOf())) {
          throw new Error("Invalid credentials");
        }
        const token: IToken = {
          id: companyQuery.id,
          type: AccountType.Company,
        };
        // credentials match, so grant them a token
        res.send({ token: JWT.create(token) });
      } catch (error) {
        res.sendStatus(401);
      }
    } catch (error) {
      res.sendStatus(400);
    }
  }

  // admin-based authentication functions
  public static async AuthenticateAdmin(req: Request, res: Response) {
    try {
      const msg = { username: req.body.username, password: req.body.password };
      Helpers.requireParameters(msg.username);
      Helpers.requireParameters(msg.password);
      // check if account exists
      const adminQuery = await getRepository(AdminAccount).findOneOrFail({
        username: msg.username,
      }).catch((error) => { throw new Error(error); });
      try {
        if (!Secrets.compareHash(adminQuery.hash.valueOf(), Secrets.hash(msg.password).valueOf())) {
          throw new Error("Invalid credentials");
        }
        // credentials match, so grant them a token
        res.send({ token: JWT.create({ id: adminQuery.id }) });
      } catch (error) {
        res.sendStatus(401);
      }
    } catch (error) {
      res.sendStatus(400);
    }
  }

  // private functions to assist previous authentication functions
  private static authenticateStudent(zID: string, password: string): boolean {
    // TODO: Implement
    return true;
  }
}
