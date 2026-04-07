import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import AppError from '../utils/AppError.js';
import { StatusCodes } from '../constants/index.js';

const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((i: any) => i.message).join(', ');
        return next(new AppError(message, StatusCodes.BAD_REQUEST));
      }
      return next(error);
    }
  };
};

export default validate;
