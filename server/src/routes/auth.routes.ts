import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { Authenticate, } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', authController.login.bind(authController));
router.get('/me', Authenticate, authController.getMe.bind(authController));
router.post('/logout',  authController.logout.bind(authController));

export default router;