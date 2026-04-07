import helmet from 'helmet';
import cors from 'cors';
import { Router } from 'express';
import { env } from '../config/index.js';

const securityMiddleware = Router();

// Set security HTTP headers
securityMiddleware.use(helmet());

// Implement CORS — restrict to explicit origin allowlist
const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
securityMiddleware.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no origin) and allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' is not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

export default securityMiddleware;
