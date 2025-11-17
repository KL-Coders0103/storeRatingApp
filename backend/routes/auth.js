import express from 'express';
import { register, login, updatePassword } from '../controllers/authController.js';
import { validateRegistration } from '../middleware/validation.js';
import { authenticatetoken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.put('/password', authenticatetoken, updatePassword);

export default router;