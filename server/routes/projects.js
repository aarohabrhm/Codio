// routes/projects.js
import express from 'express';
import { getProjects, createProject, getProjectById, updateProject } from '../controllers/projectcontroller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', authenticateToken, getProjects);

router.post('/', authenticateToken, createProject);

router.get('/:id', authenticateToken, getProjectById);

router.put('/:id', authenticateToken, updateProject);

export default router;