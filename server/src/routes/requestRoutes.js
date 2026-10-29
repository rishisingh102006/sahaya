import express from 'express';
import { requestController } from '../controllers/requestController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = express.Router();

router.get('/', optionalAuth, requestController.getAll);
router.get('/:id', optionalAuth, requestController.getById);
router.post('/', optionalAuth, requestController.create);
router.put('/:id', authenticate, authorizeRoles('ngo'), requestController.update);
router.patch('/:id/assign', optionalAuth, requestController.assignVolunteer);
router.patch('/:id/status', optionalAuth, requestController.updateStatus);
router.post('/:id/notes', optionalAuth, requestController.addNote);
router.delete('/:id', authenticate, authorizeRoles('ngo'), requestController.remove);

export default router;
