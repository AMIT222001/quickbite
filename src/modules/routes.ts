import { Router } from 'express';
import { healthRoutes } from './health/index.js';

const router = Router();

/**
 * Route registry
 */
router.use('/health', healthRoutes);

// Add more module routes here as they are created:
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);

export default router;
