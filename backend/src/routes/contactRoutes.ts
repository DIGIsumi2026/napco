import { Router } from 'express';
import { createQuoteRequest, getQuoteRequests } from '../controllers/contactController.js';

const router = Router();

router.post('/quote', createQuoteRequest);
router.get('/quotes', getQuoteRequests);

export default router;
