import express from 'express';
import { executeCode } from '../controllers/executeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", authenticateToken, executeCode);

export default router;