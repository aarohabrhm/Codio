import express from "express"
import {hello} from "./controller.js";


export const router =express.Router();


router.get("/login",hello)


export default router;
