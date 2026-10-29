import express from 'express';
import { volunteerController } from '../controllers/volunteerController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = express.Router();

router.get('/', volunteerController.getAll);
router.get('/:id', volunteerController.getById);
router.post('/', authenticate, volunteerController.create);
router.put('/:id', authenticate, volunteerController.update);
router.patch('/:id/verify', authenticate, authorizeRoles('ngo'), volunteerController.verify);
router.delete('/:id', authenticate, authorizeRoles('ngo'), volunteerController.remove);

export default router;
