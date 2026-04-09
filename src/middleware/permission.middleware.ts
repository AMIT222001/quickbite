import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/index.js';
import { StatusCodes, Messages } from '../constants/index.js';
import { permission } from 'node:process';

/**
 * Middleware to check if user has specific permissions
 * @param {...string} requiredPermissions - The slugs of the permissions required
 */
const hasPermission = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1) Ensure user is authenticated (set by protect middleware)
    if (!req.user) {
      return next(new AppError(Messages.AUTH_LOGGED_IN_REQUIRED, StatusCodes.UNAUTHORIZED));
    }

    // 2) Super Admin Bypass (optional: if role name is 'admin', allow all)
   
    if (req.user.role?.name === 'admin') {
      return next();
    }

    
    // 3) Check permissions
    const userPermissions = req.user.role?.permissions?.map(p => p.slug) || [];
    
    const hasAllPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return next(new AppError(Messages.AUTH_NO_PERMISSION, StatusCodes.FORBIDDEN));
    }

    next();
  };
};

export { hasPermission };
