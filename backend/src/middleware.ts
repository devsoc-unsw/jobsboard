import JWT from "./jwt";
import Logger from "./logging";

import { NextFunction, Request, Response } from "express";

export default class Middleware {
  public static genericLoggingMiddleware(req: Request, _: Response, next: NextFunction): void {
    Logger.Info(req.path);
    next();
  }

  public static authenticateStudentMiddleware(req: any, res: Response, next: NextFunction) {
    try {
      // get JWT for student
      const jwt = JWT.get(req.get("Authorization"));
      // add the student zID to the request object
      req.studentZID = jwt.zID;
      // continue
      next();
    } catch (error) {
      // if there are any errors, send a forbidden
      res.sendStatus(403);
    }
  }

  public static authenticateCompanyMiddleware(req: any, res: Response, next: NextFunction) {
    try {
      // get JWT
      const jwt = JWT.get(req.get("Authorization"));
      // add the companyID field to the request object
      req.companyID = jwt.id;
      // continue
      next();
    } catch (error) {
      // if there are any errors, send a forbidden
      res.sendStatus(403);
    }
  }
}
