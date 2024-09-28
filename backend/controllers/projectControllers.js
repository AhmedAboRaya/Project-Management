const Project = require("../models/projectModel.js");

const createProject = async (req, res) => {
  const { name, description, members } = req.body;
  try {
    const newProject = new Project({ name, description, members });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("members").populate("tasks");
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createProject, getAllProjects };
