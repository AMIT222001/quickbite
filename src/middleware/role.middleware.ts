import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError.js';
import { StatusCodes, Messages, UserRole } from '../constants.js';

/**
 * Middleware to restrict access to certain roles
 * @param {string[]} roles - Array of allowed roles (e.g., ['admin', 'manager'])
 */
const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Current user in req.user is set by protect middleware
    if (!req.user) {
      return next(new AppError(Messages.AUTH_LOGGED_IN_REQUIRED, StatusCodes.UNAUTHORIZED));
    }

    const userRole = req.user.role?.name ?? '';

    if (!roles.includes(userRole as UserRole)) {
      return next(
        new AppError(Messages.AUTH_NO_PERMISSION, StatusCodes.FORBIDDEN)
      );
    }

    next();
  };
};

export { restrictTo };
