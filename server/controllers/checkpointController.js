import Project from "../models/project.js";

/* ─── helpers ──────────────────────────────────────────────── */
const canEdit = (project, userId) => {
  const id = String(userId);
  return (
    String(project.owner) === id ||
    project.collaborators.some((c) => String(c) === id)
  );
};

/* ─── POST /api/projects/:id/checkpoints ───────────────────── */
export const createCheckpoint = async (req, res) => {
  try {
    const { message, description = "" } = req.body;

    if (!message?.trim())
      return res.status(400).json({ message: "Commit message is required" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!canEdit(project, req.user.id))
      return res.status(403).json({ message: "Forbidden" });

    const filesSnapshot = JSON.parse(JSON.stringify(project.files || {}));

    project.checkpoints.unshift({
      message: message.trim(),
      description: description.trim(),
      files: filesSnapshot,
      createdBy: req.user.id,
    });

    project.markModified("checkpoints");
    await project.save();

    const created = project.checkpoints[0];

    // UPDATE HEAD
    project.currentCheckpointId = created._id;
    await project.save();

    console.log("✅ Checkpoint saved:", created._id);
    return res.status(201).json(created);

  } catch (err) {
    console.error("createCheckpoint error:", err);
    return res.status(500).json({ message: "Server error", detail: err.message });
  }
};

/* ─── GET /api/projects/:id/checkpoints ────────────────────── */
export const getCheckpoints = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .select("checkpoints owner collaborators isPublic currentCheckpointId") // ADD currentCheckpointId
      .populate("checkpoints.createdBy", "fullname username avatar");

    if (!project) return res.status(404).json({ message: "Project not found" });

    const isOwner  = String(project.owner) === String(req.user.id);
    const isCollab = project.collaborators.some((c) => String(c) === String(req.user.id));
    if (!isOwner && !isCollab && !project.isPublic)
      return res.status(403).json({ message: "Forbidden" });

    const slim = project.checkpoints.map(
      ({ _id, message, description, createdBy, createdAt }) => ({
        _id, message, description, createdBy, createdAt,
      })
    );

    // Return both the list AND the current HEAD
    return res.json({ checkpoints: slim, currentCheckpointId: project.currentCheckpointId });
  } catch (err) {
    console.error("getCheckpoints error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ─── POST /api/projects/:id/checkpoints/:cpId/revert ──────── */
export const revertToCheckpoint = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!canEdit(project, req.user.id))
      return res.status(403).json({ message: "Forbidden" });

    const cp = project.checkpoints.id(req.params.cpId);
    if (!cp) return res.status(404).json({ message: "Checkpoint not found" });

    project.files = JSON.parse(JSON.stringify(cp.files));
    project.markModified("files");

    // UPDATE HEAD
    project.currentCheckpointId = cp._id;

    await project.save();

    console.log("✅ Reverted to checkpoint:", req.params.cpId);
    return res.json({ message: "Reverted", files: project.files });
  } catch (err) {
    console.error("revertToCheckpoint error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ─── DELETE /api/projects/:id/checkpoints/:cpId ───────────── */
export const deleteCheckpoint = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!canEdit(project, req.user.id))
      return res.status(403).json({ message: "Forbidden" });

    const cp = project.checkpoints.id(req.params.cpId);
    if (!cp) return res.status(404).json({ message: "Checkpoint not found" });

    // Mongoose helper to remove a subdocument
    project.checkpoints.pull(req.params.cpId);
    project.markModified("checkpoints");
    await project.save();

    console.log("✅ Deleted checkpoint:", req.params.cpId);
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteCheckpoint error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};