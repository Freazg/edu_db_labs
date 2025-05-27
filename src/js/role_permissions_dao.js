const db = require('../db');

class RolePermissionsDao {
  async findByRoleId(roleId) {
    try {
      const result = await db.query(
        'SELECT rp.*, p.code, p.description, p.module FROM role_permissions rp JOIN permissions p ON rp.permission_id = p.id WHERE rp.role_id = $1',
        [roleId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error finding role permissions:', error);
      throw error;
    }
  }

  async create(rolePermission) {
    try {
      const result = await db.query(
        'INSERT INTO role_permissions (role_id, permission_id, granted_by) VALUES ($1, $2, $3) RETURNING *',
        [rolePermission.role_id, rolePermission.permission_id, rolePermission.granted_by]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating role permission:', error);
      throw error;
    }
  }

  async delete(roleId, permissionId) {
    try {
      const result = await db.query(
        'DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2 RETURNING *',
        [roleId, permissionId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting role permission:', error);
      throw error;
    }
  }
}

module.exports = new RolePermissionsDao();