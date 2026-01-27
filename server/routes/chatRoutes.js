import express from "express";
import ChatMessage from "../models/ChatMessage.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Get all TEAM chat messages for a project
 */
router.get("/:projectId", authenticateToken, async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      projectId: req.params.projectId,
      mode: "team",
    })
      .sort({ createdAt: 1 })
      .lean();

    res.json(messages);
  } catch (err) {
    console.error("❌ Failed to load chat history:", err);
    res.status(500).json({ message: "Failed to load chat history" });
  }
});

export default router;
