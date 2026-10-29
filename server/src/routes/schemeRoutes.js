import express from 'express';
import { schemeController } from '../controllers/schemeController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = express.Router();

router.get('/', schemeController.getAll);
router.post('/eligibility', schemeController.checkEligibility);
router.get('/:id', schemeController.getById);
router.post('/', authenticate, authorizeRoles('ngo'), schemeController.create);
router.put('/:id', authenticate, authorizeRoles('ngo'), schemeController.update);
router.delete('/:id', authenticate, authorizeRoles('ngo'), schemeController.remove);

export default router;
