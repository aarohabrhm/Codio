import express from 'express';
import { register, login, verifyOtp,resendOtp } from '../controllers/authcontroller.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/resend-otp',resendOtp)

export default router;