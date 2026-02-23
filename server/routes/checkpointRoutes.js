import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  createCheckpoint,
  getCheckpoints,
  revertToCheckpoint,
  deleteCheckpoint,
} from "../controllers/checkpointController.js";

const router = express.Router({ mergeParams: true }); // mergeParams lets us read :id from parent

router.use(authenticateToken); // all checkpoint routes require auth

router.get("/",            getCheckpoints);       // GET  /api/projects/:id/checkpoints
router.post("/",           createCheckpoint);     // POST /api/projects/:id/checkpoints
router.post("/:cpId/revert", revertToCheckpoint); // POST /api/projects/:id/checkpoints/:cpId/revert
router.delete("/:cpId",    deleteCheckpoint);     // DEL  /api/projects/:id/checkpoints/:cpId

export default router;