import JWT from "./jwt";
import Logger from "./logging";

import { NextFunction, Request, Response } from "express";

import { 
  AccountType,
  IToken,
} from "./auth";

export default class Middleware {
  public static genericLoggingMiddleware(req: Request, resp: Response, next: NextFunction): void {
    Logger.Info(`${req.method} ${resp.statusCode} - ${req.path}`);
    if (next) {
      next();
    }
  }

  public static verifyTokenProperties(req: Request, jwt: IToken) {
    if (Date.now() - jwt.lastRequestTimestamp > 5 * 60 * 1000) {
      // token has expired, is now considered invalid
      throw new Error("Token has expired.");
    }
    if (req.ip != jwt.ipAddress) {
      // TODO(ad-t): Investigate this - https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
      throw new Error("IP address has changed.");
    }
  }

  public static updateTokenProperties(req: Request, jwt: IToken): IToken {
    // TODO(adam)
    jwt.lastRequestTimestamp = Date.now();
    return jwt;
  }

  public static authenticateStudentMiddleware(req: any, res: Response, next: NextFunction) {
    try {
      // get JWT for student
      const jwt: IToken = JWT.get(req.get("Authorization"));
      // ensure the token is of the correct type
      Middleware.verifyAccountType(jwt.type, AccountType.Student);
      // check if it follows required policies
      Middleware.verifyTokenProperties(req, jwt);
      // update token properties if they appear to be consistent
      Middleware.updateTokenProperties(req, jwt);
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
      Middleware.updateTokenProperties(req, jwt);
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
      Middleware.updateTokenProperties(req, jwt);
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
