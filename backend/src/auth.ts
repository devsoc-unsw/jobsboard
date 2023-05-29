import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from './config';
import AdminAccount from './entity/admin_account';
import CompanyAccount from './entity/company_account';
import { updateOrCreateStudent } from './student';
import Helpers, { IResponseWithStatus } from './helpers';
import JWT, { IToken, AccountType } from './jwt';
import { Logger, LogModule } from './logging';
import Secrets from './secrets';
import { AuthRequest } from './types/request';
import { env } from './environment';

const LM = new LogModule('AUTH');

export default class Auth {
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

          const token = JWT.create(rawToken);
          await updateOrCreateStudent(msg.zID, token);

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

  private static async authenticateStudent(zID: string, password: string): Promise<boolean> {
    if (env.NODE_ENV !== 'development') {
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

      Logger.Info(LM, `Failed to login STUDENT=${zID} due to INVALID FORMAT`);
      return false;
    }
    return true;
  }
}
