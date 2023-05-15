import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from './config';
import AdminAccount from './entity/admin_account';
import CompanyAccount from './entity/company_account';
import EStudent from './entity/student';
import Helpers, { IResponseWithStatus } from './helpers';
import JWT from './jwt';
import { Logger, LogModule } from './logging';
import Secrets from './secrets';
import { AuthRequest, VerifyTokenRequest } from './interfaces/interfaces';
import Middleware from './middleware';
import ev from './environment';

const LM = new LogModule('AUTH');

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
      async (): Promise<IResponseWithStatus> => {
        const msg = req.body;
        Helpers.requireParameters(msg.zID);
        Helpers.requireParameters(msg.password);
        const result = await Auth.authenticateStudent(msg.zID, msg.password);
        if (result === true) {
          Logger.Info(LM, `Successfully authenticated STUDENT=${msg.zID}`);

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
            Logger.Info(LM, `Created student record for STUDENT=${msg.zID}`);
          } else {
            await AppDataSource.createQueryBuilder()
              .update(EStudent)
              .set({ latestValidToken: token as string })
              .where('id = :id', { id: studentQuery.id })
              .execute();
          }

          return {
            status: StatusCodes.OK,
            msg: { token },
          };
        }
        Logger.Info(LM, `Failed to authenticate STUDENT=${msg.zID}`);
        throw new Error('Invalid credentials');
      },
      () => ({ status: StatusCodes.BAD_REQUEST, msg: undefined }),
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
      async (): Promise<IResponseWithStatus> => {
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
              LM,
              `Failed to authenticate COMPANY=${msg.username} due to INVALID CREDENTIALS`,
            );
            throw new Error('Invalid credentials');
          }
          Logger.Info(LM, `Successfully authenticated COMPANY=${msg.username}`);
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
            status: StatusCodes.OK,
            msg: { token },
          };
        } catch (error) {
          return { status: StatusCodes.UNAUTHORIZED, msg: undefined };
        }
      },
      () => ({ status: StatusCodes.BAD_REQUEST, msg: undefined }),
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
      async (): Promise<IResponseWithStatus> => {
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
            Logger.Info(
              LM,
              `Failed to authenticate ADMIN=${msg.username} due to invalid credentials`,
            );
            throw new Error('Invalid credentials');
          }
          Logger.Info(LM, `Successfully authenticated ADMIN=${msg.username}`);
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
            status: StatusCodes.OK,
            msg: { token },
          };
        } catch (error) {
          return { status: StatusCodes.UNAUTHORIZED, msg: undefined };
        }
      },
      () => ({ status: StatusCodes.BAD_REQUEST, msg: undefined }),
      next,
    );
  }

  // private functions to assist previous authentication functions
  private static async authenticateStudent(zID: string, password: string): Promise<boolean> {
    if (ev.data().NODE_ENV !== 'development') {
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
          Logger.Info(LM, `STUDENT=${zID} is logged in`);
          return true;
        }

        if (verifyResponse.status === StatusCodes.UNAUTHORIZED) {
          Logger.Info(LM, `Failed to login STUDENT=${zID} due to INCORRECT PASSWORD`);
        } else {
          Logger.Info(
            LM,
            `Failed to login STUDENT=${zID} due to ERROR CODE ${verifyResponse.status}`,
          );
        }
        return false;
      }
      // if unexpected characters are found, immediately reject
      Logger.Info(LM, `Failed to login STUDENT=${zID} due to INVALID FORMAT`);
      return false;
    }
    return true;
  }

  // check if token is valid
  public static AuthenticateToken(
    this: void,
    req: VerifyTokenRequest,
    res: Response,
    next: NextFunction,
  ) {
    // const encodedJwt = req.body.jwt;
    const { accountType } = req.body;
    let response: IResponseWithStatus;

    // currently this line does not work as jwt decryption algorithm doesn't work
    // const jwt: IToken = JWT.get(encodedJwt);

    // hard coded example
    const jwt: IToken = {
      id: 'test',
      type: AccountType.Student,
      lastRequestTimestamp: Date.now(),
      ipAddress: '::1',
    };

    // checks it token is valid or not
    try {
      Middleware.verifyToken(req, jwt, accountType);

      response = {
        status: StatusCodes.OK,
        msg: jwt,
      };
    } catch (error) {
      // Error thrown meaning that token is invalid.
      response = { status: StatusCodes.UNAUTHORIZED, msg: 'Token is invalid' };
    }

    if (response.msg === undefined) {
      res.sendStatus(response.status);
    }
    else {
      res.status(response.status).send(response.msg);
    }
    next();
  }
}
