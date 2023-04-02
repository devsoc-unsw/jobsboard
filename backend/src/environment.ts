import z from 'zod';
import dotenv from 'dotenv';

import Logger from './logging';

// ensure relevant environment variables exist
const readerSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  SERVER_PORT: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_PORT: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  MAIL_USERNAME: z.string().min(1),
  MAIL_PASSWORD: z.string().min(1),
  MAIL_SMTP_SERVER: z.string().min(1),
  MAIL_SMTP_SERVER_PORT: z.string().min(1),
});

// ensure relavant environment variables are of the correct type
const envSchema = z.object({
  NODE_ENV: z.string().min(1),
  SERVER_PORT: z.number(),
  DB_HOST: z.string().min(1),
  DB_PORT: z.number(),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  MAIL_USERNAME: z.string().min(1),
  MAIL_PASSWORD: z.string().min(1),
  MAIL_SMTP_SERVER: z.string().min(1),
  MAIL_SMTP_SERVER_PORT: z.number(),
});

type EV = z.infer<typeof envSchema>;

class Environment {
  public static data(): EV {
    if (!Environment.ev) {
      Environment.ev = Environment.parse();
    }
    return Environment.ev;
  }

  private static parse(): EV {
    dotenv.config();

    const preprocessed = readerSchema.safeParse(process.env);
    if (!preprocessed.success) {
      console.log('herasda');

      Logger.Error(
        `Couldn't process environment variables: ${JSON.stringify(
          preprocessed,
          null,
        )}`,
      );
      process.exit(1);
    }

    const parsed: EV = {
      NODE_ENV: preprocessed.data.NODE_ENV,
      SERVER_PORT: parseInt(preprocessed.data.SERVER_PORT, 10),
      DB_HOST: preprocessed.data.DB_HOST,
      DB_PORT: parseInt(preprocessed.data.DB_PORT, 10),
      DB_USER: preprocessed.data.DB_USER,
      DB_PASSWORD: preprocessed.data.DB_PASSWORD,
      DB_NAME: preprocessed.data.DB_NAME,
      MAIL_USERNAME: preprocessed.data.MAIL_USERNAME,
      MAIL_PASSWORD: preprocessed.data.MAIL_PASSWORD,
      MAIL_SMTP_SERVER: preprocessed.data.MAIL_SMTP_SERVER,
      MAIL_SMTP_SERVER_PORT: parseInt(preprocessed.data.MAIL_SMTP_SERVER_PORT, 10),
    };

    const validated = envSchema.safeParse(parsed);
    if (!validated.success) {
      Logger.Error(
        `Invalid environment variables: ${JSON.stringify(validated, null)}`,
      );
      console.log('here');
      process.exit(1);
    }

    return validated.data;
  }

  private static ev: EV;
}

export default Environment;
