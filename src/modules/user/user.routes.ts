import { Router } from 'express';
import * as userController from './user.controller.js';
import * as userSchema from './user.schema.js';
import validate from '../../middleware/validate.middleware.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

/**
 * All User Routes are protected
 */
router.use(protect);

/**
 * User Profile Routes (POST only)
 */
router.post('/me', userController.getMe);
router.post('/update', validate(userSchema.updateMeSchema), userController.updateMe);
router.post('/deactivate', userController.deleteMe);

export default router;
