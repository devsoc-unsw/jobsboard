import Logger from "./logging";
import { Response, NextFunction } from "express";
import { JobMode, JobType, StudentDemographic, WorkingRights } from "./types/job_field";

interface IResponseWithStatus {
  msg: any;
  status: number;
}

export default class Helpers {
  public static requireParameters(result: any): void {
    // if a single required parameter is undefined, the result field should evaluate to
    // undefined
    if (result === undefined) {
      throw new Error("Missing parameters.");
    }
    // convert it to a string
    result = result.toString();
    if (result.trim() === "") {
      throw new Error("Parameter is an empty string.");
    }
    if (/^\s+$/.test(result)) {
      throw new Error("Parameter is just whitespace.");
    }
  }

  public static validApplicationLink(value: string) {
    // From: https://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url
    // What: valid url regular expression
    // When: 2019-12-24
    if (/(((https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(value)) {
      return;
    }

    if (/mailto:[0-9]+/.test(value)) {
      return;
    }

    throw new Error(`Invalid mailto or HTTP[S] application link: ${value}`);
  }

  public static async doSuccessfullyOrFail(func: Function, failMessage: string) {
    const result = await func();
    if (result === undefined) {
      // Logger.Error(failMessage);
      throw new Error(failMessage);
    }
    return result;
  }

  public static async catchAndLogError(res: Response, func: Function, funcOnError: Function, next: NextFunction) {
    let response: IResponseWithStatus;
    try {
      response = await func();
    } catch (error) {
      Logger.Error(`EXCEPTION: ${error.name} - ${error.message}\nSTACK:\n${error.stack}`);
      response = await funcOnError();
    }
    if (!res.headersSent) {
      if (response.msg === undefined) {
        await res.sendStatus(response.status);
      } else {
        await res.status(response.status).send(response.msg);
      }
    } else {
      Logger.Error(`Not performing any further action as headers are already sent.`);
    }
    if (next) {
      await next();
    }
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

  public static isValidJobMode(value: string): void {
    if (value !== "onsite" && value !== "hybrid" && value !== "remote") {
      throw new Error(`Invalid JobMode=${value} provided.`);
    }
  }

  public static isValidStudentDemographic(value: string): void {
    if (value !== "penultimate" && value !== "final_year" && value !== "all") {
      throw new Error(`Invalid StudentDemogaphic=${value} provided.`);
    }
  }

  public static isValidJobType(value: string): void {
    if (value !== "intern" && value !== "grad") {
      throw new Error(`Invalid JobType=${value} provided.`);
    }
  }

  public static isValidWorkingRights(workingRights: Array<string>): void {
    workingRights.forEach(value => {
      if (
        value !== "aus_ctz" &&
        value !== "aus_perm_res" &&
        value !== "aus_stud_visa" &&
        value !== "aus_temp_grad_visa" &&
        value !== "nz_ctz_and_perm_res" &&
        value !== "no_wr" &&
        value !== "all") {
        throw new Error(`Invalid WorkingRights=${value} provided.`);
      }
    })
  }
}

export {
  IResponseWithStatus,
};
