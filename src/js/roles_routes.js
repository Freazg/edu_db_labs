const express = require('express');
const router = express.Router();
const rolesDao = require('../dao/roles');
const Role = require('../models/roles');

// GET /roles - Отримати список усіх ролей
router.get('/', async (req, res) => {
  try {
    const roles = await rolesDao.getAll();
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /roles/:id - Отримати дані ролі за ID
router.get('/:id', async (req, res) => {
  try {
    const roleId = parseInt(req.params.id);
    if (isNaN(roleId)) {
      return res.status(400).json({ error: 'Invalid role ID' });
    }

    const role = await rolesDao.getById(roleId);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /roles - Створити нову роль
router.post('/', async (req, res) => {
  try {
    const roleData = Role.sanitize(req.body);
    const validationErrors = Role.validate(roleData);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const existingRole = await rolesDao.getByName(roleData.name);
    if (existingRole) {
      return res.status(409).json({ error: 'Role with this name already exists' });
    }

    const newRole = await rolesDao.create(roleData);
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /roles/:id - Оновити дані ролі
router.put('/:id', async (req, res) => {
  try {
    const roleId = parseInt(req.params.id);
    if (isNaN(roleId)) {
      return res.status(400).json({ error: 'Invalid role ID' });
    }

    const roleData = Role.sanitize({ ...req.body, id: roleId });
    const validationErrors = Role.validate(roleData);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const existingRole = await rolesDao.getById(roleId);
    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    if (existingRole.is_system) {
      return res.status(403).json({ error: 'Cannot modify system role' });
    }

    const nameConflict = await rolesDao.getByName(roleData.name);
    if (nameConflict && nameConflict.id !== roleId) {
      return res.status(409).json({ error: 'Role with this name already exists' });
    }

    const updatedRole = await rolesDao.update(roleId, roleData);
    res.json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /roles/:id - Видалити роль
router.delete('/:id', async (req, res) => {
  try {
    const roleId = parseInt(req.params.id);
    if (isNaN(roleId)) {
      return res.status(400).json({ error: 'Invalid role ID' });
    }

    const existingRole = await rolesDao.getById(roleId);
    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    if (existingRole.is_system) {
      return res.status(403).json({ error: 'Cannot delete system role' });
    }

    await rolesDao.delete(roleId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;