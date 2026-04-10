import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';
import { env } from '../config/env.js';
import { StatusCodes, Messages, Status, Environments } from '../constants.js';

interface AppErrorLike {
  statusCode?: number;
  status?: string;
  message: string;
  stack?: string;
  isOperational?: boolean;
}

const errorHandler = (err: AppErrorLike, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || Status.ERROR;

  if (env.NODE_ENV === Environments.DEVELOPMENT) {
    logger.error({
      message: err.message,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });

    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production: Don't leak error details
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      logger.error({ err }, 'ERROR 💥 Non-operational error occurred');
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }
};

export default errorHandler;
