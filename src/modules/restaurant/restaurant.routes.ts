import { Router } from 'express';
import * as restaurantController from './restaurant.controller.js';
import * as restaurantSchema from './restaurant.schema.js';
import validate from '../../middleware/validate.middleware.js';
import { protect } from '../../middleware/auth.middleware.js';
import { restrictTo } from '../../middleware/role.middleware.js';

const router = Router();

/**
 * Public Routes
 */
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', validate(restaurantSchema.getRestaurantSchema), restaurantController.getRestaurant);

/**
 * Protected Routes
 */
router.use(protect);

router.post(
  '/',
  validate(restaurantSchema.createRestaurantSchema),
  restaurantController.createRestaurant
);

router.patch(
  '/:id',
  validate(restaurantSchema.updateRestaurantSchema),
  restaurantController.updateRestaurant
);

router.delete(
  '/:id',
  restrictTo('admin'),
  restaurantController.deleteRestaurant
);

router.post(
  '/:id/menus',
  validate(restaurantSchema.createMenuSchema),
  restaurantController.createMenu
);

router.post(
  '/menus/:id/items',
  validate(restaurantSchema.addMenuItemSchema),
  restaurantController.addMenuItem
);

export default router;
