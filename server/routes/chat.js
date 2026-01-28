router.post("/:projectId/seen", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    const unseenMessages = await ChatMessage.find({
      projectId,
      sender: { $ne: userId },
      seenBy: { $ne: userId },
    }).select("_id");

    await ChatMessage.updateMany(
      {
        projectId,
        sender: { $ne: userId },
        seenBy: { $ne: userId },
      },
      { $push: { seenBy: userId } }
    );

    // 🔥 REALTIME NOTIFY
    req.app.get("wssBroadcast")(projectId, {
      type: "CHAT_SEEN",
      payload: {
        userId,
        messageIds: unseenMessages.map(m => m._id.toString()),
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Seen error:", err);
    res.status(500).json({ message: "Failed to mark seen" });
  }
});
