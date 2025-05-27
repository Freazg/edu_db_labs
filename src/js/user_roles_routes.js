const express = require('express');
const router = express.Router();
const userRolesDao = require('../dao/user_roles_dao');

// Отримати ролі користувача
router.get('/:user_id', async (req, res) => {
  try {
    const userRoles = await userRolesDao.findByUserId(req.params.user_id);
    res.json(userRoles);
  } catch (error) {
    console.error('Error fetching user roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Призначити роль користувачу
router.post('/', async (req, res) => {
  try {
    const newUserRole = await userRolesDao.create(req.body);
    res.status(201).json(newUserRole);
  } catch (error) {
    console.error('Error assigning role to user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Скасувати роль у користувача
router.delete('/', async (req, res) => {
  try {
    const { user_id, role_id } = req.body;
    const deleted = await userRolesDao.delete(user_id, role_id);
    if (!deleted) {
      return res.status(404).json({ error: 'User role not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error removing role from user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;