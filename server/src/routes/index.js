import express from 'express';
import authRoutes from './authRoutes.js';
import requestRoutes from './requestRoutes.js';
import volunteerRoutes from './volunteerRoutes.js';
import schemeRoutes from './schemeRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import statsRoutes from './statsRoutes.js';
import systemRoutes from './systemRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/requests', requestRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/schemes', schemeRoutes);
router.use('/notifications', notificationRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/stats', statsRoutes);

// Direct shortcuts for /api/health and /api/reset
router.use('/', systemRoutes);

export default router;
