const Project = require("../models/projectModel.js");
const User = require("../models/userModel.js");

// Create a new project
const createProject = async (req, res) => {
  const { title, description, members, creatorId } = req.body;
  if (!title ||!description ||!creatorId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  members.push({ user: creatorId, role: "owner" });

  try {
    const newProject = new Project({ title, description, members });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get projects for a specific user
const getUserProjects = async (req, res) => {
  const userId = req.body; 
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const projects = await Project.find({ "members.user": userId })
      .populate("members.user")
      .populate("tasks");

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this user." });
    }
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a project (only if the user is the owner)
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the requester is the owner
    const isOwner = project.members.some(member => member.user.toString() === userId && member.role === "owner");
    if (!isOwner) {
      return res.status(403).json({ error: "Not authorized to update this project" });
    }

    // Update project fields
    project.title = title || project.title;
    project.description = description || project.description;
  
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a project (only if the user is the owner)
const deleteProject = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the requester is the owner
    const isOwner = project.members.some(member => member.user.toString() === userId && member.role === "owner");
    if (!isOwner) {
      return res.status(403).json({ error: "Not authorized to delete this project" });
    }

    await project.remove();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a member to the project (only if the user is the owner)
const addMember = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the requester is the owner
    const isOwner = project.members.some(member => member.user.toString() === req.user._id && member.role === "owner");
    if (!isOwner) {
      return res.status(403).json({ error: "Not authorized to add members to this project" });
    }

    // Check if the user is already a member
    const alreadyMember = project.members.some(member => member.user.toString() === userId);
    if (alreadyMember) {
      return res.status(400).json({ error: "User is already a member of this project" });
    }

    // Add the new member
    project.members.push({ user: userId, role });
    await project.save();

    res.json({ message: "Member added successfully", project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getUserProjects,
  updateProject,
  deleteProject,
  addMember,
};
