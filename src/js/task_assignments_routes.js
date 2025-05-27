const express = require('express');
const router = express.Router();
const taskAssignmentsDao = require('../dao/task_assignments_dao');

// Отримати призначення завдання
router.get('/:task_id', async (req, res) => {
  try {
    const taskAssignments = await taskAssignmentsDao.findByTaskId(req.params.task_id);
    res.json(taskAssignments);
  } catch (error) {
    console.error('Error fetching task assignments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Призначити завдання виконавцю
router.post('/', async (req, res) => {
  try {
    const newTaskAssignment = await taskAssignmentsDao.create(req.body);
    res.status(201).json(newTaskAssignment);
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Скасувати призначення завдання
router.delete('/', async (req, res) => {
  try {
    const { task_id, user_id } = req.body;
    const deleted = await taskAssignmentsDao.delete(task_id, user_id);
    if (!deleted) {
      return res.status(404).json({ error: 'Task assignment not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error removing task assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;