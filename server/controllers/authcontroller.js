import User from "../models/user.js";
import PendingUser from "../models/pendingUser.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });



export const getMe = async (req, res) => {
    try {
        // req.user.id comes from the middleware
        const user = await User.findById(req.user.id).select("-password -otp"); // Exclude sensitive data
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const register = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: "Username or email already exists" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await PendingUser.create({
            fullname,
            username,
            email,
            password,
            otp
        });

        const emailSubject = "Verify your account";
        const emailBody = `Hello ${fullname},\n\nYour verification code is: ${otp}\n\nThis code expires in 5 minutes.`;
        
        await sendEmail(email, emailSubject, emailBody);

        console.log(`OTP Sent to ${email}`); 

        res.status(201).json({
            message: "OTP sent to your email.",
        });
    } catch (error) {
        console.error("Register Error:", error);
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

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const pendingUser = await PendingUser.findOne({ email });

        if (!pendingUser) return res.status(400).json({ message: "OTP expired or invalid email" });
        if (pendingUser.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

        const newUser = new User({
            fullname: pendingUser.fullname,
            username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.password, 
        });

        await newUser.save();
        await PendingUser.deleteOne({ _id: pendingUser._id });

        res.status(200).json({ message: "Account verified successfully." });
    } catch (error) {
        console.error("Verify Error:", error);
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