import { NextFunction, Request, Response } from 'express';
import JWT from './jwt';
import Logger from './logging';
import { AppDataSource } from './index';
import { AccountType, IToken } from './auth';
import Student from './entity/student';
import CompanyAccount from './entity/company_account';
import { AuthoriseStudentRequest } from './interfaces/interfaces';

export default class Middleware {
  public static genericLoggingMiddleware(
    this: void,
    req: Request,
    resp: Response,
    next: NextFunction,
  ): void {
    Logger.Info(`${req.method} ${resp.statusCode} - ${req.path}`);
    if (next) {
      next();
    }
  }

  private static verifyTokenProperties(req: Request, jwt: IToken) {
    if (Date.now() - jwt.lastRequestTimestamp > 20 * 60 * 1000) {
      // token has expired, is now considered invalid
      Logger.Info(`EXPIRED TOKEN=${jwt.toString()}`);
      throw new Error('Token has expired.');
    }
    if (req.ip !== jwt.ipAddress) {
      // TODO(ad-t): Investigate this - https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
      Logger.Info(`MISMATCHED IP ADDRESS=${req.ip} COMPARED TO TOKEN=${jwt.toString()}`);
      throw new Error('IP address has changed.');
    }
  }

  private static updateTokenProperties(req: Request, jwt: IToken): IToken {
    // TODO(ad-t)
    const updatedJwt = jwt;
    updatedJwt.lastRequestTimestamp = Date.now();
    return updatedJwt;
  }

  public static async authoriseStudentMiddleware(
    this: void,
    req: AuthoriseStudentRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // get JWT for student
      const rawJWT = req.get('Authorization');
      const jwt: IToken = JWT.get(rawJWT);
      // ensure the token is of the correct type
      Middleware.verifyAccountType(jwt.type, AccountType.Student);
      // verify that this token is the latest valid token for this account
      const studentQuery = await AppDataSource.getRepository(Student)
        .createQueryBuilder()
        .where('Student.zID = :zID', { zID: jwt.id })
        .getOne();
      // check whether the tokens are equivalent
      const tokenAsString = rawJWT;
      if (tokenAsString !== studentQuery.latestValidToken) {
        // tokens don't match, therefore the token is invalid and authentication
        // is rejected
        throw new Error("Provided student token doesn't match current tracked token");
      }
      /*
      TODO(ad-t): This feature has been temporarily disabled so all tokens won't change.
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
        */
      // add the student zID to the request object
      req.studentZID = jwt.id;
      // continue
      next();
    } catch (error) {
      // if there are any errors, send a forbidden
      res.sendStatus(401);
      Middleware.genericLoggingMiddleware(req, res, undefined);
      Logger.Error(`Authentication Middleware Error (student): ${error}`);
    }
  }

  public static authoriseCompanyMiddleware(
    this: void,
    req: any,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // get JWT
      const jwt = JWT.get(req.get('Authorization'));
      // ensure the token is of the correct type
      Middleware.verifyAccountType(jwt.type, AccountType.Company);
      // check if it follows required policies
      Middleware.verifyTokenProperties(req, jwt);
      // update token properties if they appear to be consistent
      /*
      TODO(ad-t): This feature has been temporarily disabled so all tokens won't change.
      req.newJbToken = JWT.create(Middleware.updateTokenProperties(req, jwt));
      */
      // add the companyID field to the request object
      req.companyAccountID = jwt.id;
      // continue
      next();
    } catch (error) {
      // if there are any errors, send a forbidden
      res.sendStatus(401);
      Middleware.genericLoggingMiddleware(req, res, undefined);
      Logger.Error(`Authentication Middleware Error (company): ${error.toString()}`);
    }
  }

  public static authoriseAdminMiddleware(this: void, req: any, res: Response, next: NextFunction) {
    try {
      // get JWT
      const jwt: IToken = JWT.get(req.get('Authorization'));
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
      Middleware.genericLoggingMiddleware(req, res, undefined);
      Logger.Error(`Authentication Middleware Error (admin): ${error.toString()}`);
    }
  }

  public static async authenticateResetPasswordRequestMiddleware(
    this: void,
    req: any,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const jwtString = req.get('Authorization');
      const jwt: IToken = JWT.get(req.get('Authorization'));

      Middleware.verifyAccountType(jwt.type, AccountType.Company);
      // verify that this token is the latest valid token for this account
      const companyQuery = await AppDataSource.getRepository(CompanyAccount)
        .createQueryBuilder()
        .where('CompanyAccount.id = :id', { id: jwt.id })
        .getOne();
      // check whether the tokens are equivalent
      if ((jwtString as string) !== companyQuery.latestValidResetToken) {
        // tokens don't match, therefore the token is invalid and authentication
        // is rejected
        throw new Error("Provided password reset token doesn't match current tracked token");
      }
      // check that token has not expired
      Middleware.verifyTokenProperties(req, jwt);
      req.companyAccountID = jwt.id;
      // continue
      next();
    } catch (error) {
      // if there are any errors, send a forbidden
      res.sendStatus(401);
      Middleware.genericLoggingMiddleware(req, res, undefined);
      Logger.Error(`Authentication Middleware Error (reset password request): ${error.toString()}`);
    }
  }

  private static verifyAccountType(val: AccountType, expected: AccountType) {
    if (val !== expected) {
      Logger.Error('Attempted to authenticate with incorrect account type');
      throw new Error('Incorrect account type');
    }
  }

  public static privateRouteWrapper(this: void, req: any, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'development') {
      next();
    }
  }
}
