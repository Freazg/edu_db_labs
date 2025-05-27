const db = require('../db');

class PermissionsDao {
  async getAll() {
    const query = 'SELECT * FROM permissions ORDER BY module, code';
    const result = await db.query(query);
    return result.rows;
  }

  async getById(id) {
    const query = 'SELECT * FROM permissions WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async getByCode(code) {
    const query = 'SELECT * FROM permissions WHERE code = $1';
    const result = await db.query(query, [code]);
    return result.rows[0] || null;
  }

  async getByModule(module) {
    const query = 'SELECT * FROM permissions WHERE module = $1 ORDER BY code';
    const result = await db.query(query, [module]);
    return result.rows;
  }

  async create(permissionData) {
    const query = `
      INSERT INTO permissions (code, description, module)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [
      permissionData.code,
      permissionData.description,
      permissionData.module
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async update(id, permissionData) {
    const query = `
      UPDATE permissions 
      SET code = $2, description = $3, module = $4
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      permissionData.code,
      permissionData.description,
      permissionData.module
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM permissions WHERE id = $1';
    await db.query(query, [id]);
  }

  async getPermissionsByRoleId(roleId) {
    const query = `
      SELECT p.*, rp.granted_at, rp.granted_by
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1
      ORDER BY p.module, p.code
    `;
    const result = await db.query(query, [roleId]);
    return result.rows;
  }
}

module.exports = new PermissionsDao();