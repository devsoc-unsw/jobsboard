/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import winston from 'winston';
import { env } from './environment';

export class LogModule {
  constructor(module: string) {
    this.module = module;
  }

  public getModule = () => this.module;

  private module: string;
}

enum LogLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
}

enum LogLocation {
  Console,
  File,
  Both,
}

const LM = new LogModule('LOGGER');

export class Logger {
  // Only logs with a higher severity than `logLevel` will be produced
  // i.e. if logLevel is set to Info, only Info, Warn and Error logs will be produced.
  private static CreateLogger = (logLevel?: LogLevel, where?: LogLocation) => {
    const getLogLevel = () => {
      if (env.NODE_ENV === 'production') {
        return LogLevel.Info;
      }
      return logLevel || LogLevel.Info;
    };

    const getTransport = () => {
      const fileTransport = new winston.transports.File({
        filename: 'server.log',
        level: getLogLevel(),
      });

      const consoleTransport = new winston.transports.Console();

      if (env.NODE_ENV === 'production' || !where) {
        return [consoleTransport];
      }

      switch (Number(where)) {
        case LogLocation.Console:
          return [consoleTransport];
        case LogLocation.File:
          return [fileTransport];
        case LogLocation.Both:
          return [consoleTransport, fileTransport];
        default:
          break;
      }

      throw new Error('Invalid transport for creating the logger.');
    };

    const format = winston.format.printf(
      ({
        level, message, logModule, timestamp,
      }) => `${timestamp} [${level}] [${logModule}] ${message}`,
    );

    const logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format,
      ),
      levels: winston.config.syslog.levels,
      transports: getTransport(),
    });

    logger.log({
      level: LogLevel.Info,
      message: 'LOGGER INITIALISED\n',
      logModule: LM.getModule(),
    });

    return logger;
  };

  public static Warn(logModule: LogModule, msg: string): void {
    Logger.loggerFunc(LogLevel.Warn, msg, logModule);
  }

  public static Error(logModule: LogModule, msg: string): void {
    Logger.loggerFunc(LogLevel.Error, msg, logModule);
  }

  public static Info(logModule: LogModule, msg: string): void {
    Logger.loggerFunc(LogLevel.Info, msg, logModule);
  }

  public static Debug(logModule: LogModule, msg: string): void {
    Logger.loggerFunc(LogLevel.Debug, msg, logModule);
  }

  private static loggerFunc(lvl: string, msg: string, logModule: LogModule) {
    Logger.logger.log({
      level: lvl,
      message: msg,
      logModule: logModule.getModule(),
    });
  }

  // feel free to pass arguments into createLogger to change the log level and where it logs to
  // while on local development
  private static logger: winston.Logger = this.CreateLogger();
}
