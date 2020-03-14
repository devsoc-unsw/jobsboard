import JWT from "./jwt";
import Logger from "./logging";

import { NextFunction, Request, Response } from "express";
import {
  getConnection,
  getRepository
} from "typeorm";

import Helpers from "./helpers";

import { 
  AccountType,
  IToken,
} from "./auth";

import { Student } from "./entity/student";

export default class Middleware {
  public static genericLoggingMiddleware(req: Request, resp: Response, next: NextFunction): void {
    Logger.Info(`${req.method} ${resp.statusCode} - ${req.path}`);
    if (next) {
      next();
    }
  }

  private static verifyTokenProperties(req: Request, jwt: IToken) {
    if (Date.now() - jwt.lastRequestTimestamp > 5 * 60 * 1000) {
      // token has expired, is now considered invalid
      throw new Error("Token has expired.");
    }
    if (req.ip != jwt.ipAddress) {
      // TODO(ad-t): Investigate this - https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
      throw new Error("IP address has changed.");
    }
  }

  private static updateTokenProperties(req: Request, jwt: IToken): IToken {
    // TODO(ad-t)
    jwt.lastRequestTimestamp = Date.now();
    return jwt;
  }

  public static async authenticateStudentMiddleware(req: any, res: Response, next: NextFunction) {
    try {
      // get JWT for student
      const rawJWT = req.get("Authorization");
      const jwt: IToken = JWT.get(rawJWT);
      // ensure the token is of the correct type
      Middleware.verifyAccountType(jwt.type, AccountType.Student);
      // verify that this token is the latest valid token for this account
      const studentQuery = await Helpers.doSuccessfullyOrFail(async () => {
        return await getRepository(Student)
        .createQueryBuilder()
        .where("Student.zID = :zID", { zID: jwt.id })
        .getOne();
      }, `Couldn't find or create a student record with zID: ${jwt.id}`);
      // check whether the tokens are equivalent
      const tokenAsString = rawJWT as string;
      if (tokenAsString !== studentQuery.latestValidToken) {
        // tokens don't match, therefore the token is invalid and authentication
        // is rejected
        throw new Error("Provided student token doesn't match current tracked token");
      }
      // check if it follows required policies
      Middleware.verifyTokenProperties(req, jwt);
      // update token properties if they appear to be consistent
      req.newJbToken = JWT.create(Middleware.updateTokenProperties(req, jwt));
      // update token tracking in database
      await getConnection().createQueryBuilder()
        .update(Student)
        .set({ latestValidToken: req.newJbToken as string})
        .where("id = :id", { id: studentQuery.id })
        .execute();
      // add the student zID to the request object
      req.studentZID = jwt.id;
      // continue
      next();
    } catch (error) {
      // if there are any errors, send a forbidden
      res.sendStatus(401);
    }
  }

  public static authenticateCompanyMiddleware(req: any, res: Response, next: NextFunction) {
    try {
      // get JWT
      const jwt = JWT.get(req.get("Authorization"));
      // ensure the token is of the correct type
      Middleware.verifyAccountType(jwt.type, AccountType.Company);
      // check if it follows required policies
      Middleware.verifyTokenProperties(req, jwt);
      // update token properties if they appear to be consistent
      req.newJbToken = JWT.create(Middleware.updateTokenProperties(req, jwt));
      // add the companyID field to the request object
      req.companyAccountID = jwt.id;
      // continue
      next();
    } catch (error) {
      // if there are any errors, send a forbidden
      res.sendStatus(401);
    }
  }

  public static authenticateAdminMiddleware(req: any, res: Response, next: NextFunction) {
    try {
      // get JWT
      const jwt: IToken = JWT.get(req.get("Authorization"));
      // ensure the token is of the correct type
      Middleware.verifyAccountType(jwt.type, AccountType.Admin);
      // check if it follows required policies
      Middleware.verifyTokenProperties(req, jwt);
      // update token properties if they appear to be consistent
      req.newJbToken = JWT.create(Middleware.updateTokenProperties(req, jwt));
      // add the admin id to the request
      req.adminID = jwt.id;
      // continue
      next();
    } catch (error) {
      // send forbidden on any errors
      res.sendStatus(401);
    }
  }

  private static verifyAccountType(val: AccountType, expected: AccountType) {
    if (val !== expected) {
      throw new Error("Incorrect account type");
    }
  }
}
