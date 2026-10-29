import express from 'express';
import { feedbackController } from '../controllers/feedbackController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, feedbackController.getAll);
router.post('/', optionalAuth, feedbackController.submit);

export default router;
