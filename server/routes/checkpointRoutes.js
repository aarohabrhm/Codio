import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  createCheckpoint,
  getCheckpoints,
  revertToCheckpoint,
  deleteCheckpoint,
} from "../controllers/checkpointController.js";

const router = express.Router({ mergeParams: true });
router.use(authenticateToken);
router.get("/",            getCheckpoints);
router.post("/",           createCheckpoint);
router.post("/:cpId/revert", revertToCheckpoint);
router.delete("/:cpId",    deleteCheckpoint);

export default router;