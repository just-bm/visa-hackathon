import Router from 'express';
import { apiDataExtraction } from '../controllers/api.controller.js';

const router = Router();

router.post('/source', apiDataExtraction);

export default router;