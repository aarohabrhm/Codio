import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { aiChat } from "../controllers/aiController.js";

const router = express.Router();
router.post("/chat", authenticateToken, aiChat);
export default router;