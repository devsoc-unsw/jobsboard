import z from 'zod';
import dotenv from 'dotenv';
import { createEnv } from '@t3-oss/env-core';

dotenv.config();

console.log(process.env);

export const env = createEnv({
  clientPrefix: undefined,
  server: {
    NODE_ENV: z.enum(['development', 'production']),
    SERVER_PORT: z
      .string()
      .min(1)
      .transform((v) => parseInt(v, 10)),
    DB_HOST: z.string().min(1),
    DB_PORT: z
      .string()
      .min(1)
      .transform((v) => parseInt(v, 10)),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),
    MAIL_USERNAME: z.string().email(),
    MAIL_PASSWORD: z.string().min(1),
    MAIL_SMTP_SERVER: z.string().min(1),
    MAIL_SMTP_SERVER_PORT: z
      .string()
      .min(1)
      .transform((v) => parseInt(v, 10)),
  },
  client: undefined,
  runtimeEnv: process.env,
});
