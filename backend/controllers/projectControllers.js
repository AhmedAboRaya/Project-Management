const Project = require("../models/projectModel.js");
const User = require("../models/userModel.js");
const mongoose = require("mongoose");

// Create a new project
const createProject = async (req, res) => {
  const { title, description, members = [], creatorId } = req.body;

  if (!title || !description || !creatorId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingProject = await Project.findOne({
    title,
    "members.user": creatorId, 
  });

  if (existingProject) {
    return res.status(400).json({ message: "A project with this title already exists for this user." });
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
  const {userId} = req.body; 
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }
  const user = await User.findById(userId)
  if (!user) {
    return res.status(400).json({ message: "User not found" });
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
  const { title, description, userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "User ID are required." });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isOwner = project.members.some(member => member.user.toString() === userId && member.role === "owner");
    if (!isOwner) {
      return res.status(403).json({ error: "Not authorized to update this project" });
    }

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

  // Validate the project ID
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid project ID." });
  }

  const project = await Project.findById(id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  // Validate the user ID
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: "Invalid user ID." });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  try {
    const isOwner = project.members.some(member => member.user.toString() === userId && member.role === "owner");
    if (!isOwner) {
      return res.status(403).json({ error: "Not authorized to delete this project" });
    }

    await project.deleteOne({ _id: id });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a member to the project (only if the user is the owner)
const addMember = async (req, res) => {
  const { id } = req.params;
  const { userEmail, role, adderId } = req.body;

  const validRoles = ["owner", "manager", "contributor", "viewer"]; 

  if (!userEmail || !role || !adderId) {
    return res.status(400).json({ message: "User email, role, and adder ID are required." });
  }
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role. Allowed roles are: owner, manager, contributor, viewer." });
  }
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid project ID." });
  }
  if (!mongoose.isValidObjectId(adderId)) {
    return res.status(400).json({ error: "Invalid adder ID." });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (role === "owner") {
      return res.status(400).json({ error: "Administrator role is not allowed." });
    }

    const alreadyMember = project.members.some(member => member.user.toString() === user._id.toString());
    if (alreadyMember) {
      return res.status(400).json({ error: "User is already a member of this project" });
    }

    const isOwner = project.members.some(member => member.user.toString() === adderId && member.role === "owner");
    if (!isOwner) {
      return res.status(403).json({ error: "Not authorized to add members to this project" });
    }

    project.members.push({ user: user._id, role });
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
