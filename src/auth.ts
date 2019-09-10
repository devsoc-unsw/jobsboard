import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import JWT from "./jwt";

export default class Auth {
  // Student-based authentication functions

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

  public static authenticateStudent(zID: string, password: string): boolean {
    // TODO: Implement
    return true;
  }

  // Company-based authentication functions

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

  public static hash(msg: string): string {
    return crypto.createHash("sha512").update(msg).digest("hex");
  }
}
