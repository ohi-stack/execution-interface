import express from 'express';
import { loginHandler, logoutHandler, sessionHandler } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginHandler);
router.post('/logout', logoutHandler);
router.get('/session', sessionHandler);

export default router;
