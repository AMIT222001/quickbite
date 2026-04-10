import dotenv from 'dotenv';
import path from 'path';

// Load environmental variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

export const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'root',
  DB_NAME: process.env.DB_NAME || 'quickbite',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_COOKIE_EXPIRES_IN: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '1', 10),
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',
  KAFKA_BROKER: process.env.KAFKA_BROKER || 'localhost:9092',
};
