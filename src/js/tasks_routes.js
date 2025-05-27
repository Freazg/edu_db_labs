const express = require('express');
const router = express.Router();
const tasksDAO = require('../dao/tasks_dao');
const Task = require('../models/tasks_model');

// GET /tasks - Отримати всі завдання
router.get('/', async (req, res) => {
  try {
    const tasks = await tasksDAO.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /tasks/:id - Отримати завдання за ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await tasksDAO.getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /tasks/project/:projectId - Отримати завдання за проєктом
router.get('/project/:projectId', async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const tasks = await tasksDAO.getTasksByProject(projectId);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /tasks - Створити нове завдання
router.post('/', async (req, res) => {
  try {
    const validation = Task.validate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const task = await tasksDAO.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Referenced project does not exist' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /tasks/:id - Оновити завдання
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const validation = Task.validate({ ...req.body, project_id: 1 }); // project_id не оновлюється
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const task = await tasksDAO.updateTask(id, req.body);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /tasks/:id - Видалити завдання
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await tasksDAO.deleteTask(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;