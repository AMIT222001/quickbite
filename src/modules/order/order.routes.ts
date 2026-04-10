import { Router } from 'express';
import * as orderController from './order.controller.js';
import * as orderSchema from './order.schema.js';
import validate from '../../middleware/validate.middleware.js';
import { protect } from '../../middleware/auth.middleware.js';
import { restrictTo } from '../../middleware/role.middleware.js';

const router = Router();

router.use(protect);

/**
 * User Routes
 */
router.post(
  '/',
  validate(orderSchema.placeOrderSchema),
  orderController.placeOrder
);

router.get('/', orderController.getUserOrders);

router.get(
  '/:id',
  validate(orderSchema.getOrderSchema),
  orderController.getOrder
);

router.post(
  '/:id/cancel',
  validate(orderSchema.getOrderSchema),
  orderController.cancelOrder
);

/**
 * Admin/Owner Routes
 */
router.patch(
  '/:id/status',
  validate(orderSchema.updateOrderStatusSchema),
  orderController.updateOrderStatus
);

router.get(
  '/admin/all',
  restrictTo('admin'),
  orderController.getAllOrders
);

export default router;
