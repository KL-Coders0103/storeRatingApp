import express from 'express';
import { getStores, getStoresById, createStore } from '../controllers/storeController.js';
import { authenticatetoken } from '../middleware/auth.js';
import { validateStore } from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticatetoken, getStores);
router.get('/:id', authenticatetoken, getStoresById);
router.post('/',authenticatetoken, validateStore, createStore);

export default router;