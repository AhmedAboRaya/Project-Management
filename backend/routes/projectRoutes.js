const express = require('express');

const { createProject, getAllProjects } = require('../controllers/projectControllers.js');

const router = express.Router();

router.post('/', createProject);

router.get('/', getAllProjects);

module.exports = router;
