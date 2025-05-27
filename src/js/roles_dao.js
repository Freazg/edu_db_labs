const db = require('../db');

class RolesDao {
  async getAll() {
    const query = 'SELECT * FROM roles ORDER BY name';
    const result = await db.query(query);
    return result.rows;
  }

  async getById(id) {
    const query = 'SELECT * FROM roles WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async getByName(name) {
    const query = 'SELECT * FROM roles WHERE name = $1';
    const result = await db.query(query, [name]);
    return result.rows[0] || null;
  }

  async create(roleData) {
    const query = `
      INSERT INTO roles (name, description, is_system)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [
      roleData.name,
      roleData.description,
      roleData.is_system || false
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async update(id, roleData) {
    const query = `
      UPDATE roles 
      SET name = $2, description = $3, is_system = $4
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      roleData.name,
      roleData.description,
      roleData.is_system
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM roles WHERE id = $1';
    await db.query(query, [id]);
  }

  async getRolesByUserId(userId) {
    const query = `
      SELECT r.*, ur.assigned_at, ur.assigned_by
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = $1
      ORDER BY r.name
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }
}

module.exports = new RolesDao();