import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project",
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  senderUsername: String,
  senderAvatar: String,

  text: {
    type: String,
    required: true,
  },

  mode: {
    type: String,
    enum: ["team", "ai"],
    default: "team",
  },

}, { timestamps: true });

export default mongoose.model("ChatMessage", chatMessageSchema);
