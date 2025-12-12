import express from 'express';
import { register, login, verifyOtp,resendOtp,getMe, forgotPassword,resetPassword} from '../controllers/authcontroller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/user.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique name
    }
});
const upload = multer({ storage: storage });



router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/resend-otp',resendOtp)
router.get('/me', authenticateToken, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


router.post('/upload-avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        // Update DB
        await User.findByIdAndUpdate(req.user.id, { avatar: avatarUrl });
        
        res.json({ message: "Avatar updated", avatar: avatarUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
export default router;