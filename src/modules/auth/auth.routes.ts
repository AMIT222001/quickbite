import { Router } from 'express';
import * as authController from './auth.controller.js';
import * as authSchema from './auth.schema.js';
import validate from '../../middleware/validate.middleware.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

/**
 * Public Routes (POST only)
 */
router.post('/register', validate(authSchema.registerSchema), authController.register);
router.post('/login', validate(authSchema.loginSchema), authController.login);
router.post('/forgot-password', validate(authSchema.forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password/:token', validate(authSchema.resetPasswordSchema), authController.resetPassword);

/**
 * Protected Routes (POST only)
 */
router.use(protect);

router.post('/logout', authController.logout);
router.post('/change-password', validate(authSchema.changePasswordSchema), authController.updatePassword);

export default router;
