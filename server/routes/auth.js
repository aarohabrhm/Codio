import express from 'express';
import { register, login, verifyOtp,resendOtp,getMe} from '../controllers/authcontroller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/resend-otp',resendOtp)
router.get('/me', authenticateToken, getMe);
export default router;