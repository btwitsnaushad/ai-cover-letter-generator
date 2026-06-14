import express from 'express';
import { generateCoverLetterController } from '../controllers/generateController.js';

const router = express.Router();

// Premium Endpoint Route
router.post('/generate', generateCoverLetterController);

export default router;