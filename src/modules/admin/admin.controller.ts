import { Request, Response, NextFunction } from 'express';
import { User, Role } from '../../models/index.js';
import { catchAsync, AppError } from '../../utils/index.js';
import { StatusCodes, Messages, Status } from '../../constants.js';
import { Op } from 'sequelize';

/**
 * List all users (via POST /api/v1/admin/users)
 * Supports pagination, search, and filtering in POST body.
 */
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10, search, role } = req.body;
  const offset = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const include: any[] = [{ model: Role, as: 'role' }];
  if (role) {
    include[0].where = { name: role };
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    include,
    limit: Number(limit),
    offset: Number(offset),
    order: [['createdAt', 'DESC']],
  });

  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    results: count,
    data: {
      users: rows,
    },
  });
});

/**
 * Change any user's role (via POST /api/v1/admin/role)
 */
export const updateUserRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, role } = req.body;

  // 1) Find the target role
  const targetRole = await Role.findOne({ where: { name: role } });
  if (!targetRole) {
    return next(new AppError(Messages.ROLE_NOT_FOUND, StatusCodes.BAD_REQUEST));
  }

  // 2) Update user's role
  const [updatedCount] = await User.update(
    { roleId: targetRole.id },
    { where: { id: userId } }
  );

  if (updatedCount === 0) {
    return next(new AppError(Messages.USER_NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    message: `User role updated to ${role}`,
  });
});

/**
 * Activate or deactivate any user account (via POST /api/v1/admin/status)
 */
export const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, isActive } = req.body;

  const [updatedCount] = await User.update(
    { isActive },
    { where: { id: userId } }
  );

  if (updatedCount === 0) {
    return next(new AppError(Messages.USER_NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    message: `User account ${isActive ? 'activated' : 'deactivated'} successfully`,
  });
});
