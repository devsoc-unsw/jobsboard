/* eslint-disable import/prefer-default-export */

import z from 'zod';
import dotenv from 'dotenv';
import { createEnv } from '@t3-oss/env-core';

dotenv.config();

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production']),
    SERVER_PORT: z.coerce.number(),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    MAIL_USERNAME: z.string(),
    MAIL_PASSWORD: z.string(),
    MAIL_SMTP_SERVER: z.string(),
    MAIL_SMTP_SERVER_PORT: z.coerce.number(),
    BUCKET_NAME: z.string(),
    BUCKET_REGION: z.string(),
    BUCKET_ACCESS_KEY: z.string(),
    BUCKET_SECRET_ACCESS_KEY: z.string(),
  },
  runtimeEnv: process.env,
});
