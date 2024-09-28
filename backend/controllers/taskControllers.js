const Task = require("../models/taskModel.js");
const User = require("../models/userModel.js");
const Project = require("../models/projectModel.js");
const mongoose = require("mongoose");

// Create a task for a specific user
const createTask = async (req, res) => {
  const { assignedToEmail, projectId, title, description, dueDate } = req.body;

  if (!assignedToEmail || !projectId || !title || !description || !dueDate) {
    return res
      .status(400)
      .json({
        error:
          "Assigned email, project ID, title, description, and due date are required",
      });
  }

  const user = await User.findById(req.params.userId); // Assuming userId is passed in the request parameters
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: "Invalid project ID format" });
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const isOwnerOrManager = project.members.some(
    (member) =>
      member.user.toString() === req.params.userId &&
      (member.role === "owner" || member.role === "manager")
  );

  if (!isOwnerOrManager) {
    return res.status(403).json({ error: "Not authorized to create tasks" });
  }

  const formattedDueDate = dueDate.split("-").reverse().join("-");
  if (new Date(formattedDueDate) < new Date()) {
    return res.status(400).json({ error: "Due date must be in the future" });
  }

  const assignedUser = await User.findOne({ email: assignedToEmail });
  if (!assignedUser) {
    return res.status(404).json({ error: "Assigned user not found" });
  }

  const assignedMember = project.members.find(
    (member) => member.user.toString() === assignedUser._id.toString()
  );
  if (assignedMember && assignedMember.role === "viewer") {
    return res
      .status(400)
      .json({ error: "Assigned user cannot have the role of viewer" });
  }

  try {
    const newTask = new Task({
      title,
      description,
      assignedTo: assignedUser._id,
      createdBy: req.params.userId,
      project: project._id,
      dueDate: formattedDueDate,
    });

    await newTask.save();

    project.tasks.push(newTask);

    await project.save();

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
      .populate("createdBy");

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
  const { updater } = req.body;

  // Check if the updater ID is provided
  if (!updater) {
    return res.status(400).json({ error: "Updater field is required" });
  }

  // Validate the ID formats
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }
  if (!mongoose.Types.ObjectId.isValid(updater)) {
    return res.status(400).json({ error: "Invalid updater ID format" });
  }

  // Check if the user exists
  const user = await User.findById(updater);
  if (!user) {
    return res.status(404).json({ error: "User ID not found" });
  }

  // Fetch the updates
  const updates = req.body;

  // Find the task by ID
  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  // Find the associated project
  const project = await Project.findById(task.project);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  // Check if the updater is an owner or manager in the project
  const isOwnerOrManager = project.members.some(
    (member) =>
      member.user.toString() === updater &&
      (member.role === "owner" || member.role === "manager")
  );

  if (!isOwnerOrManager) {
    return res
      .status(403)
      .json({ error: "Not authorized to update this task" });
  }

  // Ensure that updates are provided
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No updates provided" });
  }

  try {
    // Update the task and also reflect the changes in the project
    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    // Update the task in the project as well
    project.tasks = project.tasks.map((task) =>
      task._id.toString() === id ? updatedTask : task
    );

    // Save the updated project
    await project.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;
  const { deleter } = req.body;

  if (!deleter) {
    return res.status(400).json({ error: "Deleter field is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }
  if (!mongoose.Types.ObjectId.isValid(deleter)) {
    return res.status(400).json({ error: "Invalid deleter ID format" });
  }

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const project = await Project.findById(task.project);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const isOwnerOrManager = project.members.some(member => 
    member.user.toString() === deleter && (member.role === "owner" || member.role === "manager")
  );

  if (!isOwnerOrManager) {
    return res.status(403).json({ error: "Not authorized to delete this task" });
  }

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    project.tasks = project.tasks.filter(task => task._id.toString() !== id);
    await project.save();

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
