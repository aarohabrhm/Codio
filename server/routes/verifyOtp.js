import User from "../models/user.js";
import PendingUser from "../models/pendingUser.js"; 

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const pendingUser = await PendingUser.findOne({ email });

        if (!pendingUser) {
            return res.status(400).json({ message: "OTP expired or invalid email" });
        }

        if (pendingUser.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const newUser = new User({
            fullname: pendingUser.fullname,
            username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.password, 
        });

        await newUser.save();

        await PendingUser.deleteOne({ _id: pendingUser._id });

        res.status(200).json({ message: "Account verified successfully. You can now login." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
};