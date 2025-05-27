const express = require('express');
const router = express.Router();
const rolePermissionsDao = require('../dao/role_permissions_dao');

// Отримати дозволи ролі
router.get('/:role_id', async (req, res) => {
  try {
    const rolePermissions = await rolePermissionsDao.findByRoleId(req.params.role_id);
    res.json(rolePermissions);
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Надати дозвіл ролі
router.post('/', async (req, res) => {
  try {
    const newRolePermission = await rolePermissionsDao.create(req.body);
    res.status(201).json(newRolePermission);
  } catch (error) {
    console.error('Error granting permission to role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Скасувати дозвіл у ролі
router.delete('/', async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;
    const deleted = await rolePermissionsDao.delete(role_id, permission_id);
    if (!deleted) {
      return res.status(404).json({ error: 'Role permission not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error removing permission from role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;