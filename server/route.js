import express from "express"
import {hello} from "./controller.js";
import {verifyOtp} from "./routes/verifyOtp.js";


export const router =express.Router();


router.get("/login",hello)
router.post("/verify-otp",verifyOtp)


export default router;
