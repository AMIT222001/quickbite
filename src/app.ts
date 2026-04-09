import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { AppError } from './utils/index.js';
import { errorHandler, securityMiddleware, httpLogger, globalRateLimiter, sanitize } from './middleware/index.js';
import { StatusCodes, Messages } from './constants/index.js';

// Route imports
import { readFileSync } from 'fs';
import { join } from 'path';
import swaggerUi from 'swagger-ui-express';
import mainRouter from './modules/routes.js';

// Read swagger.json
const swaggerPath = join(process.cwd(), 'src/swagger.json');
const swaggerDocument = JSON.parse(readFileSync(swaggerPath, 'utf8'));

const app = express();

// 1) GLOBAL MIDDLEWARES
// Security headers and CORS
app.use(securityMiddleware);

// HTTP request logger
app.use(httpLogger);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Cookie parser for HttpOnly JWT cookies
app.use(cookieParser());

// Global rate limiter
app.use('/api', globalRateLimiter);

// Input sanitization — strip HTML/script tags from all request inputs
app.use(sanitize);

// 2) ROUTES
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', mainRouter);


// 3) UNHANDLED ROUTES
app.use( (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(Messages.NOT_FOUND(req.originalUrl), StatusCodes.NOT_FOUND));
});

// 4) GLOBAL ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

export default app;
