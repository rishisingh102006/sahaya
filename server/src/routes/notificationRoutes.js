import express from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, notificationController.getAll);
router.patch('/:id/read', optionalAuth, notificationController.markAsRead);
router.patch('/read-all', optionalAuth, notificationController.markAllAsRead);
router.post('/', optionalAuth, notificationController.create);
router.delete('/:id', optionalAuth, notificationController.remove);

export default router;
