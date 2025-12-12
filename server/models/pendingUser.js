import mongoose from "mongoose";


const pendingUserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }
});

export default mongoose.model("PendingUser", pendingUserSchema);