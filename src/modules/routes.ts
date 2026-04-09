import { Router } from 'express';
import { healthRoutes, authRoutes, userRoutes, adminRoutes } from './index.js';

const router = Router();

/**
 * Route registry
 */
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

export default router;
