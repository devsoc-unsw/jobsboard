/* eslint-disable */
// ! will hopefully be rewritten or discarded so no need to lint it

import winston from 'winston';
import Logs from './entity/logs';
import { AppDataSource } from './config';

export default class Logger {
  public static Init(): void {
    Logger.logger = winston.loggers.add(Logger.loggerName, {
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((i) => `[${i.level}] ${i.timestamp} - ${i.message}`),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  public static Info(msg: string): void {
    Logger.loggerFunc('info', msg);
  }

  public static Warn(msg: string): void {
    Logger.loggerFunc('warn', msg);
  }

  public static Error(msg: string): void {
    Logger.loggerFunc('error', msg);
  }

  private static loggerName = 'logger';

  private static logger: winston.Logger;

  // this is intentionally async and it's not used with an await so as not to
  // become blocking to the functions calling it
  private static async loggerFunc(lvl: string, msg: string) {
    Logger.logger.log({
      level: lvl,
      message: msg,
    });

    // write the log
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Logs)
      .values([{ what: msg }])
      .execute();
  }
}
