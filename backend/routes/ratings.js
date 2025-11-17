import express from 'express';
import { submitRating, getUserRating } from '../controllers/ratingcontroller.js';
import { authenticatetoken } from '../middleware/auth.js';


const router = express.Router();

router.post('/',authenticatetoken,submitRating);
router.get('/store/:storeId', authenticatetoken,getUserRating);

export default router;
