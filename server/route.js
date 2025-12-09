import express from "express"
import {hello} from "./controller.js";
import {verifyOtp} from "./routes/verifyOtp.js";
import { login } from "./controllers/authcontroller.js";


export const router =express.Router();


router.get("/login",hello)
router.post("/verify-otp",verifyOtp)
router.post('/register',login)

export default router;
