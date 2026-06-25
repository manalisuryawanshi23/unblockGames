import { Router } from 'express';
import * as authController from '../controllers/auth';

const router = Router();

router.post('/login', authController.login);
router.post('/setup', authController.setupAdmin);

export default router;
