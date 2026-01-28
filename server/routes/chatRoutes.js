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
      .lean()
      .then(msgs =>
        msgs.map(m => ({
          ...m,
          senderId: m.sender.toString(),
          seenBy: m.seenBy ? m.seenBy.map(id => id.toString()) : [],
        }))
      );

    res.json(messages);
  } catch (err) {
    console.error("❌ Failed to load chat history:", err);
    res.status(500).json({ message: "Failed to load chat history" });
  }
});

/**
 * Mark messages as seen
 */
router.post("/:projectId/seen", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    const unseenMessages = await ChatMessage.find({
      projectId,
      sender: { $ne: userId },
      seenBy: { $ne: userId },
    }).select("_id");

    if (unseenMessages.length === 0) {
      return res.json({ success: true, updated: 0 });
    }

    await ChatMessage.updateMany(
      {
        projectId,
        sender: { $ne: userId },
        seenBy: { $ne: userId },
      },
      { $push: { seenBy: userId } }
    );

    // 🔥 REALTIME NOTIFY
    const wssBroadcast = req.app.get("wssBroadcast");
    if (wssBroadcast) {
      wssBroadcast(projectId, {
        type: "CHAT_SEEN",
        payload: {
          userId,
          messageIds: unseenMessages.map(m => m._id.toString()),
        },
      });
    }

    res.json({ success: true, updated: unseenMessages.length });
  } catch (err) {
    console.error("❌ Seen error:", err);
    res.status(500).json({ message: "Failed to mark seen" });
  }
});

export default router;