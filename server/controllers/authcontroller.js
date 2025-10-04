import User from "../models/user.js";

// REGISTER USER WITH OTP
export const register = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: "username or email already exists" });
        }

        // generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

        // create user with OTP
        const user = new User({
            fullname,
            username,
            email,
            password,
            otp,
            otpExpires,
            isVerified: false,
        });

        await user.save();

        // for now just log OTP (replace with nodemailer later)
        console.log(`OTP for ${email}: ${otp}`);

        res.status(201).json({
            message: "User created successfully. Please verify OTP sent to your email.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: "Account verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
};

// LOGIN (only if verified)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email first" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
};
