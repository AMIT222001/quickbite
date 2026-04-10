import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/index.js';
import { catchAsync, AppError } from '../../utils/index.js';
import { StatusCodes, Messages, Status } from '../../constants.js';

/**
 * Get current user profile (via POST /api/v1/user/me)
 */
export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    data: {
      user: req.user,
    },
  });
});

/**
 * Update current user profile (via POST /api/v1/user/update)
 */
export const updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Post error if user tries to update password here
  if (req.body.password) {
    return next(new AppError(Messages.INVALID_PASSWORD_ROUTE, StatusCodes.BAD_REQUEST));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody: any = {};
  if (req.body.email) filteredBody.email = req.body.email;
  if (req.body.firstName) filteredBody.firstName = req.body.firstName;
  if (req.body.lastName) filteredBody.lastName = req.body.lastName;

  // 3) Update user document
  const updatedUser = await User.update(filteredBody, {
    where: { id: req.user!.id },
    returning: true,
  });

  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    data: {
      user: updatedUser[1][0],
    },
  });
});

/**
 * Deactivate current user (via POST /api/v1/user/deactivate)
 */
export const deleteMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await User.update({ isActive: false }, { where: { id: req.user!.id } });

  res.status(StatusCodes.NO_CONTENT).json({
    status: Status.SUCCESS,
    data: null,
  });
});
