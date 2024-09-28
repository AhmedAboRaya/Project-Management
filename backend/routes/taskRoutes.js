const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskControllers.js"); 

const router = express.Router();

// Create a task for a specific user
router.post("/users/:userId", createTask);

// Get tasks for a specific user
router.get("/users/:userId", getTasks);

// Update a specific task
router.put("/:id", updateTask);

// Delete a specific task
router.delete("/:id", deleteTask);

module.exports = router;
