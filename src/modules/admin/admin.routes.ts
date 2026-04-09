import { Router } from 'express';
import * as adminController from './admin.controller.js';
import * as adminSchema from './admin.schema.js';
import { validate, protect, hasPermission } from '../../middleware/index.js';

const router = Router();

/**
 * All Admin Routes are protected by authentication
 */
router.use(protect);

/**
 * Admin Management Routes (POST only)
 */
router.post(
  '/users',
  hasPermission('manage:users'),
  validate(adminSchema.listUsersSchema),
  adminController.getAllUsers
);

router.post(
  '/role',
  hasPermission('manage:roles'),
  validate(adminSchema.updateRoleSchema),
  adminController.updateUserRole
);

router.post(
  '/status',
  hasPermission('manage:users'),
  validate(adminSchema.updateStatusSchema),
  adminController.updateUserStatus
);

export default router;
