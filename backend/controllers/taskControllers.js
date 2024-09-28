const Task = require("../models/taskModel.js");
const User = require("../models/userModel.js");

// Create a task for a specific user
const createTask = async (req, res) => {
  const { userId } = req.params; 
  const { creatorId, projectId, title, description, dueDate } = req.body;
  if( !creatorId || !projectId || !title || !description || !dueDate) {
    return res.status(400).json({ error: "Creator ID, project ID, title, description, and due date are required" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const project = await Project.findById(projectId); 
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  if (!creatorId) {
    return res.status(400).json({ error: "Creator ID is required" });
  }

  if (new Date(dueDate) < new Date()) {
    return res.status(400).json({ error: "Due date must be in the future" });
  }

  try {
    const newTask = new Task({ title, description, assignedTo: userId, createdBy: creatorId, project: projectId, dueDate });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get tasks for a specific user
const getTasks = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const tasks = await Task.find({ assignedTo: userId })
      .populate("assignedTo")
      .populate("createdBy"); // Populate createdBy to get the user details
    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user." });
    }
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updates = req.body;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No updates provided" });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
