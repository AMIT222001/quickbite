import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import { AppError, catchAsync } from '../utils/index.js';
import { User, Role } from '../models/index.js';
import { StatusCodes, Messages } from '../constants/index.js';
import type { JWTPayload } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Getting token — support both cookie and Bearer header
  let token: string | undefined;

  if (req.cookies?.jwt) {
    token = req.cookies.jwt as string;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError(Messages.AUTH_NOT_LOGGED_IN, StatusCodes.UNAUTHORIZED));
  }

  // 2) Verify token
  const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

  // 3) Check if user still exists
  const currentUser = await User.findByPk(decoded.id, {
    include: [{ model: Role, as: 'role' }],
  });

  if (!currentUser) {
    return next(new AppError(Messages.AUTH_USER_NOT_FOUND, StatusCodes.UNAUTHORIZED));
  }

  // 4) Check if user is active
  if (!currentUser.isActive) {
    return next(new AppError(Messages.AUTH_DEACTIVATED, StatusCodes.UNAUTHORIZED));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

export { protect };
