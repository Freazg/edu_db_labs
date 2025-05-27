const express = require('express');
const router = express.Router();
const projectMembersDao = require('../dao/project_members_dao');

// Отримати учасників проєкту
router.get('/:project_id', async (req, res) => {
  try {
    const projectMembers = await projectMembersDao.findByProjectId(req.params.project_id);
    res.json(projectMembers);
  } catch (error) {
    console.error('Error fetching project members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Додати учасника до проєкту
router.post('/', async (req, res) => {
  try {
    const newProjectMember = await projectMembersDao.create(req.body);
    res.status(201).json(newProjectMember);
  } catch (error) {
    console.error('Error adding member to project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Видалити учасника з проєкту
router.delete('/', async (req, res) => {
  try {
    const { project_id, user_id } = req.body;
    const deleted = await projectMembersDao.delete(project_id, user_id);
    if (!deleted) {
      return res.status(404).json({ error: 'Project member not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error removing member from project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;