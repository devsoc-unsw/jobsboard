import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Logger from './logging';
import {
  JobMode,
  JobType,
  StudentDemographic,
  WamRequirements,
  WorkingRights,
} from './types/job-field';

interface IResponseWithStatus {
  msg: unknown;
  status: StatusCodes;
}

export default class Helpers {
  public static requireParameters(result: unknown): void {
    if (result === undefined) {
      throw new Error('Missing parameters.');
    }
    const str = result.toString();
    if (str.trim() === '') {
      throw new Error('Parameter is an empty string.');
    }
    if (/^\s+$/.test(str)) {
      throw new Error('Parameter is just whitespace.');
    }
  }

  public static validApplicationLink(value: string) {
    // From: https://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url
    // What: valid url regular expression
    // When: 2019-12-24
    if (
      // eslint-disable-next-line no-useless-escape
      /(((https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
        value,
      )
    ) {
      return;
    }

    if (/mailto:[0-9]+/.test(value)) {
      return;
    }

    throw new Error(`Invalid mailto or HTTP[S] application link: ${value}`);
  }

  public static async doSuccessfullyOrFail<TReturn>(
    func: () => Promise<TReturn>,
    failMessage: string,
  ): Promise<TReturn> {
    const res = await func();
    if (res === undefined) {
      Logger.Error(failMessage);
      throw new Error(failMessage);
    }
    return res;
  }

  public static async catchAndLogError(
    res: Response,
    func: () => Promise<IResponseWithStatus>,
    funcOnError: () => IResponseWithStatus,
    next?: NextFunction,
  ) {
    let response: IResponseWithStatus;
    try {
      response = await func();
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.Error(`EXCEPTION: ${error.name} - ${error.message}\nSTACK:\n${error.stack}`);
      } else {
        Logger.Error('Unknown error was thrown');
      }
      response = funcOnError();
    }
    if (!res.headersSent) {
      if (response.msg === undefined) {
        res.sendStatus(response.status);
      } else {
        res.status(response.status).send(response.msg);
      }
    } else {
      Logger.Error('Not performing any further action as headers are already sent.');
    }
    if (next) next();
  }

  public static doesMatchZidFormat(result: string) {
    if (!/^z[0-9]{7}$/.test(result)) {
      throw new Error(`zID ${result} doesn't match required format`);
    }
  }

  public static isDateInTheFuture(val: number) {
    if (val <= Date.now()) {
      throw new Error(`Attempted to create a job post with a date in the past=${val}`);
    }
  }

  public static isValidJobMode(value: JobMode): void {
    this.requireParameters(value);
    if (!Object.values(JobMode).includes(value)) {
      throw new Error(`Invalid JobMode=${value} provided.`);
    }
  }

  public static isValidStudentDemographic(studentDemographic: Array<StudentDemographic>): void {
    this.requireParameters(studentDemographic);
    if (!Array.isArray(studentDemographic)) {
      throw new Error('studentDemographic is not an array.');
    }
    studentDemographic.forEach((value) => {
      if (!Object.values(StudentDemographic).includes(value)) {
        throw new Error(`Invalid StudentDemogaphic=${value} provided.`);
      }
    });
  }

  public static isValidJobType(value: JobType): void {
    this.requireParameters(value);
    if (!Object.values(JobType).includes(value)) {
      throw new Error(`Invalid JobType=${value} provided.`);
    }
  }

  public static isValidWorkingRights(workingRights: Array<WorkingRights>): void {
    this.requireParameters(workingRights);
    if (!Array.isArray(workingRights)) {
      throw new Error('workingRights is not an array.');
    }
    workingRights.forEach((value) => {
      if (!Object.values(WorkingRights).includes(value)) {
        throw new Error(`Invalid WorkingRights=${value} provided.`);
      }
    });
  }

  public static isValidWamRequirement(value: WamRequirements): void {
    this.requireParameters(value);
    if (!Object.values(WamRequirements).includes(value)) {
      throw new Error(`Invalid WamRequirements=${value} provided.`);
    }
  }
}

export { IResponseWithStatus };
