import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/index.js';
import { StatusCodes, Status, Messages, HealthStatus } from '../../constants/index.js';
import { sequelize } from '../../config/index.js';

const healthCheck = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let dbStatus: string = HealthStatus.UP;
  try {
    await sequelize.authenticate();
  } catch (err) {
    dbStatus = HealthStatus.DOWN;
  }

  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    message: Messages.HEALTH_CHECK_SUCCESS,
    data: {
      status: HealthStatus.UP,
      uptime: `${process.uptime().toFixed(2)} seconds`,
      database: dbStatus,
      timestamp: new Date().toISOString(),
    },
  });
});

export default { healthCheck };
