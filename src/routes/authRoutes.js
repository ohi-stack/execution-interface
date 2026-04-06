import { Router } from 'express';
import { getRoles, getValidate, postLogin } from '../controllers/authController.js';
import { authenticateToken, requireRoles } from '../middleware/auth.js';

const router = Router();

router.post('/login', postLogin);
router.get('/validate', getValidate);
router.get('/roles', authenticateToken, requireRoles(['admin', 'issuer', 'maintainer', 'release_manager']), getRoles);

export default router;
