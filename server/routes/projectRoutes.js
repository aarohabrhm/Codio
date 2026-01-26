import express from "express";
import Project from "../models/project.js"; // Ensure this path matches your structure

const router = express.Router();

// 1. GET Project Files (Load Editor)
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    // Return the project data. The 'files' field contains your tree structure.
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. SAVE Project Files
router.put("/save", async (req, res) => {
  const { projectId, files } = req.body;

  if (!projectId || !files) {
    return res.status(400).json({ message: "Missing data" });
  }

  await Project.findByIdAndUpdate(
    projectId,
    { files },
    { new: true }
  );

  res.json({ success: true });
});


// 3. CREATE Project (Helper for testing/dashboard)
router.post("/create", async (req, res) => {
  try {
    const { title, owner, description } = req.body;

    // Default template for a new project
    const defaultFiles = {
      "root": { id: "root", name: "root", type: "folder", parentId: null, children: ["main-file"], isOpen: true },
      "main-file": { id: "main-file", name: "main.js", type: "file", parentId: "root", content: "// Start coding..." }
    };

    const newProject = new Project({
      title,
      description,
      owner, 
      files: defaultFiles
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;