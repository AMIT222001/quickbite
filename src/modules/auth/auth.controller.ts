import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { User, Role, Permission, RefreshToken } from '../../models/index.js';
import { AppError, catchAsync } from '../../utils/index.js';
import { env } from '../../config/index.js';
import { StatusCodes, Messages } from '../../constants/index.js';

/**
 * Sign a JWT token
 */
const signToken = (id: string): string => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

/**
 * Create and send token in cookie
 */
const createSendToken = async (user: User, statusCode: number, res: Response) => {
  const token = signToken(user.id);

  const cookieOptions: any = {
    expires: new Date(
      Date.now() + (env.JWT_COOKIE_EXPIRES_IN as number) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  // Ensure role and permissions are loaded for the response
  if (!user.role || !user.role.permissions) {
    const userWithRole = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: 'role',
          include: [{ model: Permission, as: 'permissions' }],
        },
      ],
    });
    if (userWithRole) {
      user.role = userWithRole.role;
    }
  }

  res.status(statusCode).json({
    status: 'success',
    token,
    role: user.role?.name,
    permissions: user.role?.permissions?.map((p: any) => p.slug) || [],
    data: {
      user,
    },
  });
};

/**
 * Register a new user
 */
export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName } = req.body;

  // 1) Find default 'user' role
  const userRole = await Role.findOne({ where: { name: 'user' } });
  if (!userRole) {
    return next(new AppError('Default role not found', StatusCodes.INTERNAL_SERVER_ERROR));
  }
  // const hashedPassword:string=await User.hashPassword(password)
  // 2) Create new user
  const newUser = await User.create({
    email,
    password,
    firstName,
    lastName,
    roleId: userRole.id,
  });

  await createSendToken(newUser, StatusCodes.CREATED, res);
});

/**
 * Login user
 */
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError(Messages.AUTH_INVALID_CREDENTIALS, StatusCodes.BAD_REQUEST));
  }

  // 2) Check if user exists && password is correct
  const user = await User.scope('withSecret').findOne({
    where: { email },
    include: [
      {
        model: Role,
        as: 'role',
        include: [{ model: Permission, as: 'permissions' }]
      }
    ]
  });
  // console.log(password);
  console.info(user?.dataValues);
  console.log(password)
  console.log(user?.comparePassword(password))

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError(Messages.AUTH_INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED));
  }

  // 3) Check if user is active
  if (!user.isActive) {
    return next(new AppError(Messages.AUTH_DEACTIVATED, StatusCodes.UNAUTHORIZED));
  }

  // 4) If everything ok, send token to client
  await createSendToken(user, StatusCodes.OK, res);
});

/**
 * Logout user
 */
export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({ status: 'success' });
};

/**
 * Forgot Password
 */
export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(new AppError(Messages.AUTH_USER_NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validate: false });

  // 3) Send it (In a real app, send email. Here we just return it for demonstration as requested)
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Token sent to email (Demonstration: token returned in response)',
    resetToken,
  });
});

/**
 * Reset Password
 */
export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Get user based on token
  if (!req.params.token) {
    return next(new AppError(Messages.AUTH_INVALID_TOKEN, StatusCodes.BAD_REQUEST));
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token as string)
    .digest('hex');

  const user = await User.scope('withSecret').findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: new Date() },
    },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError(Messages.AUTH_INVALID_TOKEN, StatusCodes.BAD_REQUEST));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Log the user in, send JWT
  await createSendToken(user, StatusCodes.OK, res);
});

/**
 * Update Password
 */
export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Get user from collection
  const user = await User.scope('withSecret').findByPk(req.user!.id);

  // 2) Check if POSTed current password is correct
  if (!(await user!.comparePassword(req.body.passwordCurrent))) {
    return next(new AppError(Messages.AUTH_INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED));
  }

  // 3) If so, update password
  user!.password = req.body.password;
  await user!.save();

  // 4) Log user in, send JWT
  await createSendToken(user!, StatusCodes.OK, res);
});
