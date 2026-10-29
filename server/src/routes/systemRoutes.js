import express from 'express';
import { systemController } from '../controllers/systemController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = express.Router();

router.get('/health', systemController.health);
router.post('/reset', authenticate, authorizeRoles('ngo'), systemController.reset);

export default router;
