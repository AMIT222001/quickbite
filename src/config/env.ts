import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DB_URL: z.string().optional(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_NAME: z.string().default('resume_db'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters for security'),
  JWT_EXPIRES_IN: z.string().or(z.number()).default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().or(z.number()).default('7d'),
  JWT_COOKIE_EXPIRES_IN: z.coerce.number().default(1), // days
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY must be at least 32 characters for security'),
  MFA_WINDOW: z.coerce.number().default(1),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err) => err.path.join('.')).join(', ');
      process.stderr.write(`❌ Invalid environment variables: ${missingVars}\n`);
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();
