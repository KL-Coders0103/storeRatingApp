import express from 'express';
import { createStore, createUser, getAdminDashboard, getStores, getUserDetails, getUsers, updateUserRole } from '../controllers/adminControllers.js';
import { authenticatetoken, requiredRole } from '../middleware/auth.js';
import { validateRegistration, validateStore } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticatetoken, requiredRole(['admin']));

router.get('/dashboard', getAdminDashboard);

router.get('/users', getUsers);
router.post('/users', validateRegistration, createUser);
router.get('/users/:userId', getUserDetails);
router.put('/users/:userId/role', updateUserRole);

router.get('/stores', getStores);
router.post('/stores', validateStore, createStore);

export default router;
