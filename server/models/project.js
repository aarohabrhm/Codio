import mongoose from "mongoose";

// ── Checkpoint subdocument ─────────────────────────────────────────────────
// Defined as its own Schema so Mongoose treats it as a real subdocument array
// (gets _id, .id(), etc.) rather than a plain Mixed/Object field.
const checkpointSchema = new mongoose.Schema(
  {
    message:     { type: String, required: true },
    description: { type: String, default: "" },
    // `files` is a deep snapshot of the project's entire file tree at commit time.
    // It must be Object/Mixed because your file tree is a dynamic nested object.
    // We call markModified manually in the controller when needed.
    files:       { type: mongoose.Schema.Types.Mixed, required: true },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }   // adds createdAt / updatedAt per checkpoint
);

// ── Project ────────────────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true },
    description:   { type: String },
    owner:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    image:         { type: String, default: "" },
    isPublic:      { type: Boolean, default: false },
    // `files` is the LIVE file tree — also Mixed for the same reason
    files:         { type: mongoose.Schema.Types.Mixed, default: {} },
    // Array of checkpoint subdocuments — newest first by convention
    checkpoints:   { type: [checkpointSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);