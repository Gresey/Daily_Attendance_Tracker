import { Router } from 'express';
const router = Router();
import { handleCardUpdateDetails } from '../controllers/cardupdate.js';

router.get('/dashboard',handleCardUpdateDetails);

export default router;
