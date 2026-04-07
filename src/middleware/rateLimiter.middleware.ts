import rateLimit from 'express-rate-limit';
import { StatusCodes, Status } from '../constants/index.js';

/**
 * Strict rate limiter for auth endpoints to prevent brute-force attacks.
 * 10 requests per 15 minutes per IP.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message: {
    status: Status.FAIL,
    message: 'Too many attempts from this IP, please try again after 15 minutes.',
  },
});

/**
 * General API rate limiter applied globally.
 * 200 requests per 15 minutes per IP.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message: {
    status: Status.FAIL,
    message: 'Too many requests from this IP, please try again later.',
  },
});
