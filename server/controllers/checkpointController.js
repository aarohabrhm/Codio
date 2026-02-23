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
// Body: { message, description? }
export const createCheckpoint = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!canEdit(project, req.user.id))
      return res.status(403).json({ message: "Forbidden" });

    const { message, description = "" } = req.body;
    if (!message?.trim())
      return res.status(400).json({ message: "Commit message is required" });

    // Push newest checkpoint to the FRONT so index-0 is always latest
    project.checkpoints.unshift({
      message: message.trim(),
      description: description.trim(),
      files: JSON.parse(JSON.stringify(project.files)), // deep-clone current files
      createdBy: req.user.id,
    });

    project.markModified("checkpoints");
    await project.save();

    // Return only the new checkpoint (caller gets the id, etc.)
    const created = project.checkpoints[0];
    return res.status(201).json(created);
  } catch (err) {
    console.error("createCheckpoint error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ─── GET /api/projects/:id/checkpoints ────────────────────── */
export const getCheckpoints = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .select("checkpoints owner collaborators isPublic")
      .populate("checkpoints.createdBy", "fullname username avatar");

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Public projects — anyone can read; private — must be member
    const isOwner = String(project.owner) === String(req.user.id);
    const isCollab = project.collaborators.some(
      (c) => String(c) === String(req.user.id)
    );
    if (!isOwner && !isCollab && !project.isPublic)
      return res.status(403).json({ message: "Forbidden" });

    // Strip the heavy `files` blob from the list view — send only metadata
    const slim = project.checkpoints.map(({ _id, message, description, createdBy, createdAt }) => ({
      _id,
      message,
      description,
      createdBy,
      createdAt,
    }));

    return res.json(slim);
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

    // Restore files from the snapshot
    project.files = JSON.parse(JSON.stringify(cp.files));
    project.markModified("files");
    await project.save();

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

    const idx = project.checkpoints.findIndex(
      (c) => String(c._id) === req.params.cpId
    );
    if (idx === -1) return res.status(404).json({ message: "Checkpoint not found" });

    project.checkpoints.splice(idx, 1);
    project.markModified("checkpoints");
    await project.save();

    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteCheckpoint error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};