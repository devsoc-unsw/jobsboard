import z from 'zod';
import dotenv from 'dotenv';
import { createEnv } from '@t3-oss/env-core';

dotenv.config();

export const env = createEnv({
  clientPrefix: undefined,
  server: {
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
  },
  client: undefined,
  runtimeEnv: process.env,
  isServer: true,
});

// ensure relevant environment variables exist
// const readerSchema = z.object({
//   NODE_ENV: z.enum(['development', 'production']),
//   SERVER_PORT: z.string().min(1),
//   DB_HOST: z.string().min(1),
//   DB_PORT: z.string().min(1),
//   DB_USER: z.string().min(1),
//   DB_PASSWORD: z.string().min(1),
//   DB_NAME: z.string().min(1),
//   MAIL_USERNAME: z.string().min(1),
//   MAIL_PASSWORD: z.string().min(1),
//   MAIL_SMTP_SERVER: z.string().min(1),
//   MAIL_SMTP_SERVER_PORT: z.string().min(1),
// });

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
    // const preprocessed = readerSchema.safeParse(process.env);
    // if (!preprocessed.success) {
    //   throw new Error('Unable to read environment variables. Exiting.');
    // }
    const parsed: EV = {
      NODE_ENV: env.NODE_ENV,
      SERVER_PORT: parseInt(env.SERVER_PORT, 10),
      DB_HOST: env.DB_HOST,
      DB_PORT: parseInt(env.DB_PORT, 10),
      DB_USER: env.DB_USER,
      DB_PASSWORD: env.DB_PASSWORD,
      DB_NAME: env.DB_NAME,
      MAIL_USERNAME: env.MAIL_USERNAME,
      MAIL_PASSWORD: env.MAIL_PASSWORD,
      MAIL_SMTP_SERVER: env.MAIL_SMTP_SERVER,
      MAIL_SMTP_SERVER_PORT: parseInt(env.MAIL_SMTP_SERVER_PORT, 10),
    };

    const validated = envSchema.safeParse(parsed);
    if (!validated.success) {
      throw new Error('Unable to parse environment variables into the correct types. Exiting.');
    }

    return validated.data;
  }

  private static ev: EV;
}

export default Environment;
