import { Router } from 'express';
import { authRoutes } from './auth/index.js';
import { userRoutes } from './user/index.js';
import { adminRoutes } from './admin/index.js';
import { healthRoutes } from './health/index.js';
import { restaurantRouter } from './restaurant/index.js';
import { orderRouter } from './order/index.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/restaurants', restaurantRouter);
router.use('/orders', orderRouter);

export default router;
