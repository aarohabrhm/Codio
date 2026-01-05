
import Project from "../models/project.js";
import User from "../models/user.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_FILES = {
  "root": {
    id: "root",
    name: "root",
    type: "folder",
    path: "/root",
    isOpen: true,
    children: ["main.js", "readme.md"]
  },
  "main.js": {
    id: "main.js",
    name: "main.js",
    type: "file",
    path: "/root/main.js",
    parent: "root",
    content: "// Welcome to your new project!\nconsole.log('Hello World');"
  },
  "readme.md": {
    id: "readme.md",
    name: "README.md",
    type: "file",
    path: "/root/readme.md",
    parent: "root",
    content: "# New Project\n\nThis is a sample project."
  }
};

const getRandomCoverUrl = (req) => {
  try {
    const coverDir = path.join(__dirname, "../project-covers");
    if (fs.existsSync(coverDir)) {
      const files = fs.readdirSync(coverDir);
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      if (imageFiles.length > 0) {
        const randomFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
        return `${req.protocol}://${req.get('host')}/project-covers/${randomFile}`;
      }
    }
  } catch (err) {
    console.error("Cover selection error:", err);
  }
  return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80";
};

export const createProject = async (req, res) => {
  try {
    const { title, description, collaboratorEmails } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    // Normalise collaborator emails
    let collaborators = [];
    if (collaboratorEmails) {
      const emailsArr = Array.isArray(collaboratorEmails)
        ? collaboratorEmails
        : String(collaboratorEmails).split(',').map(e => e.trim()).filter(Boolean);

      if (emailsArr.length) {
        const users = await User.find({ email: { $in: emailsArr } }).select('_id');
        collaborators = users.map(u => u._id);
      }
    }

    const coverImage = getRandomCoverUrl(req);

    const newProject = new Project({
      title,
      description,
      owner: req.user.id,
      image: coverImage,
      collaborators,
      isPublic: collaborators.length === 0 ? false : true,
      files: DEFAULT_FILES
    });

    await newProject.save();

    // populate before sending back
    await newProject.populate('owner', 'fullname username email');
    await newProject.populate('collaborators', 'fullname username email');

    return res.status(201).json(newProject);
  } catch (error) {
    console.error('createProject error:', error);
    return res.status(500).json({ message: "Failed to create project" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
    })
      .select('-files')
      .populate('owner', 'fullname username avatar email')
      .populate('collaborators', 'fullname username avatar email')
      .sort({ updatedAt: -1 });

    return res.json(projects);
  } catch (error) {
    console.error('getProjects error', error);
    return res.status(500).json({ message: "Error fetching projects" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate('owner', 'fullname username avatar email')
      .populate('collaborators', 'fullname username avatar email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Auth check
    const isOwner = String(project.owner._id) === String(req.user.id);
    const isCollaborator = project.collaborators.some(c => String(c._id) === String(req.user.id));

    if (!isOwner && !isCollaborator && !project.isPublic) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    return res.json(project);
  } catch (error) {
    console.error('getProjectById error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Only owner/collab can update
    const isOwner = String(project.owner) === String(req.user.id);
    const isCollaborator = project.collaborators.some(collabId => String(collabId) === String(req.user.id));

    if (!isOwner && !isCollaborator) {
         return res.status(403).json({ message: 'Permission denied' });
    }

    // --- FIX: Update files if provided ---
    if (updates.files) {
        project.files = updates.files;
        project.markModified('files'); // Required for Mixed/Object types in Mongoose
    }

    // Update metadata (Owner only for sensitive fields)
    if (isOwner) {
        if (updates.title) project.title = updates.title;
        if (updates.description) project.description = updates.description;
        if (updates.isPublic !== undefined) project.isPublic = updates.isPublic;
    }

    await project.save();
    return res.json(project);
  } catch (error) {
    console.error('updateProject error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
