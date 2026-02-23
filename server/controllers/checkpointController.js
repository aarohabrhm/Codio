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

    // 1. Load project
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!canEdit(project, req.user.id))
      return res.status(403).json({ message: "Forbidden" });

    // 2. Deep-clone the files at this exact moment
    const filesSnapshot = JSON.parse(JSON.stringify(project.files || {}));

    // 3. Unshift (prepend) to Mongoose array so it auto-generates the _id
    project.checkpoints.unshift({
      message: message.trim(),
      description: description.trim(),
      files: filesSnapshot,
      createdBy: req.user.id,
    });

    // 4. Explicitly tell Mongoose the array changed, then save
    project.markModified("checkpoints");
    await project.save();

    // 5. Return the newly created checkpoint (now guaranteed to have an _id)
    const created = project.checkpoints[0];
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
      .select("checkpoints owner collaborators isPublic")
      .populate("checkpoints.createdBy", "fullname username avatar");

    if (!project) return res.status(404).json({ message: "Project not found" });

    const isOwner  = String(project.owner) === String(req.user.id);
    const isCollab = project.collaborators.some((c) => String(c) === String(req.user.id));
    if (!isOwner && !isCollab && !project.isPublic)
      return res.status(403).json({ message: "Forbidden" });

    // Omit the heavy `files` blob from the list — just metadata
    const slim = project.checkpoints.map(
      ({ _id, message, description, createdBy, createdAt }) => ({
        _id, message, description, createdBy, createdAt,
      })
    );

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

    // Overwrite the live files with the checkpoint's snapshot
    project.files = JSON.parse(JSON.stringify(cp.files));

    // CRITICAL: Mongoose requires this for 'Mixed' / 'Object' types!
    project.markModified("files");
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