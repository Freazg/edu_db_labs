const express = require('express');
const router = express.Router();
const permissionsDao = require('../dao/permissions');
const Permission = require('../models/permissions');

// GET /permissions - Отримати список усіх дозволів
router.get('/', async (req, res) => {
  try {
    const permissions = await permissionsDao.getAll();
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /permissions/:id - Отримати дані дозволу за ID
router.get('/:id', async (req, res) => {
  try {
    const permissionId = parseInt(req.params.id);
    if (isNaN(permissionId)) {
      return res.status(400).json({ error: 'Invalid permission ID' });
    }

    const permission = await permissionsDao.getById(permissionId);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    res.json(permission);
  } catch (error) {
    console.error('Error fetching permission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /permissions - Створити новий дозвіл
router.post('/', async (req, res) => {
  try {
    const permissionData = Permission.sanitize(req.body);
    const validationErrors = Permission.validate(permissionData);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const existingPermission = await permissionsDao.getByCode(permissionData.code);
    if (existingPermission) {
      return res.status(409).json({ error: 'Permission with this code already exists' });
    }

    const newPermission = await permissionsDao.create(permissionData);
    res.status(201).json(newPermission);
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /permissions/:id - Оновити дані дозволу
router.put('/:id', async (req, res) => {
  try {
    const permissionId = parseInt(req.params.id);
    if (isNaN(permissionId)) {
      return res.status(400).json({ error: 'Invalid permission ID' });
    }

    const permissionData = Permission.sanitize({ ...req.body, id: permissionId });
    const validationErrors = Permission.validate(permissionData);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const existingPermission = await permissionsDao.getById(permissionId);
    if (!existingPermission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    const codeConflict = await permissionsDao.getByCode(permissionData.code);
    if (codeConflict && codeConflict.id !== permissionId) {
      return res.status(409).json({ error: 'Permission with this code already exists' });
    }

    const updatedPermission = await permissionsDao.update(permissionId, permissionData);
    res.json(updatedPermission);
  } catch (error) {
    console.error('Error updating permission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /permissions/:id - Видалити дозвіл
router.delete('/:id', async (req, res) => {
  try {
    const permissionId = parseInt(req.params.id);
    if (isNaN(permissionId)) {
      return res.status(400).json({ error: 'Invalid permission ID' });
    }

    const existingPermission = await permissionsDao.getById(permissionId);
    if (!existingPermission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    await permissionsDao.delete(permissionId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting permission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;