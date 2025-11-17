import express from 'express';
import { getStoreOwnerDashboard, getStoreRatings } from '../controllers/storeOwnerController.js';
import { authenticatetoken, requiredRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticatetoken, requiredRole(['store_owner']));

router.get('/dashboard', getStoreOwnerDashboard);
router.get('/ratings', getStoreRatings);

export default router;