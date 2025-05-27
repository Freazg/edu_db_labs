const express = require('express');
const router = express.Router();
const projectsDao = require('../dao/projects');
const Project = require('../models/projects');

// GET /projects - Отримати список усіх проєктів
router.get('/', async (req, res) => {
  try {
    const projects = await projectsDao.getAll();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /projects/:id - Отримати дані проєкту за ID
router.get('/:id', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await projectsDao.getById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /projects/owner/:ownerId - Отримати проєкти за власником
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const ownerId = parseInt(req.params.ownerId);
    if (isNaN(ownerId)) {
      return res.status(400).json({ error: 'Invalid owner ID' });
    }

    const projects = await projectsDao.getByOwnerId(ownerId);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects by owner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /projects - Створити новий проєкт
router.post('/', async (req, res) => {
  try {
    const projectData = Project.sanitize(req.body);
    const validationErrors = Project.validate(projectData);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const newProject = await projectsDao.create(projectData);
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /projects/:id - Оновити дані проєкту
router.put('/:id', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const projectData = Project.sanitize({ ...req.body, id: projectId });
    const validationErrors = Project.validate(projectData);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const existingProject = await projectsDao.getById(projectId);
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updatedProject = await projectsDao.update(projectId, projectData);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /projects/:id - Видалити проєкт
router.delete('/:id', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const existingProject = await projectsDao.getById(projectId);
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await projectsDao.delete(projectId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;