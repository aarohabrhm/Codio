import User from "../models/user.js";
import PendingUser from "../models/pendingUser.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });



export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -otp");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        
        const pendingUser = await PendingUser.findOne({ email });
        if (!pendingUser) {
            return res.status(400).json({ message: "No pending registration found." });
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        
        pendingUser.otp = newOtp;
        pendingUser.createdAt = Date.now(); 
        await pendingUser.save();

        await sendEmail(email, "Resend OTP Code", `Your new verification code is: ${newOtp}`);

        res.status(200).json({ message: "OTP resent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const accesstoken = jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        res.status(200).json({ message: "Login successful", accesstoken, refreshToken });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist" });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 300000;
        await user.save();
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
        const emailBody = `You requested a password reset.\n\nPlease click the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`;
        
        await sendEmail(email, "Password Reset Request", emailBody);

        res.status(200).json({ message: "Password reset link sent to your email." });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error, could not send email." });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired." });
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password has been reset successfully." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error." });
    }
};
const getRandomAvatarUrl = (req) => {
    try {
        const avatarDir = path.join(__dirname, "../avatar");
        if (fs.existsSync(avatarDir)) {
            const files = fs.readdirSync(avatarDir);
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
            
            if (imageFiles.length > 0) {
                const randomFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
                // Returns: http://localhost:8000/avatar/fileName.jpg
                return `${req.protocol}://${req.get('host')}/avatar/${randomFile}`;
            }
        }
    } catch (err) {
        console.error("Avatar selection error:", err);
    }
    // Fallback if folder is empty
    return "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 
};


export const register = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;
        // ... (check existing user logic) ...

        // 1. Generate URL
        const avatarUrl = getRandomAvatarUrl(req);
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Save to PendingUser
        await PendingUser.create({
            fullname, username, email, password, otp,
            avatar: avatarUrl 
        });

        // ... (Send Email Logic) ...
        
        res.status(201).json({ message: "OTP sent." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// --- VERIFY OTP ---
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const pendingUser = await PendingUser.findOne({ email });
        
        // ... (Validation logic) ...

        // 3. Transfer Avatar to Real User
        const newUser = new User({
            fullname: pendingUser.fullname,
            username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.password, 
            avatar: pendingUser.avatar // <--- Crucial Step
        });

        await newUser.save();
        await PendingUser.deleteOne({ _id: pendingUser._id });

        res.status(200).json({ message: "Account verified." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};