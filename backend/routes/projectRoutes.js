const express = require('express');
const {
  createProject,
  getUserProjects,
  updateProject,
  deleteProject,
  addMember,
} = require('../controllers/projectControllers.js');

const router = express.Router();

// Create a new project
router.post('/', createProject);

// Get projects for the authenticated user
router.get('/', getUserProjects);

// Update a project (only if the user is the owner)
router.put('/:id', updateProject);

// Delete a project (only if the user is the owner)
router.delete('/:id', deleteProject);

// Add a member to the project (only if the user is the owner)
router.post('/:id/members', addMember);

module.exports = router;
