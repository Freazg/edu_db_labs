const db = require('../db');

class UserRolesDao {
  async findByUserId(userId) {
    try {
      const result = await db.query(
        'SELECT ur.*, r.name as role_name FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = $1',
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error finding user roles:', error);
      throw error;
    }
  }

  async create(userRole) {
    try {
      const result = await db.query(
        'INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES ($1, $2, $3) RETURNING *',
        [userRole.user_id, userRole.role_id, userRole.assigned_by]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user role:', error);
      throw error;
    }
  }

  async delete(userId, roleId) {
    try {
      const result = await db.query(
        'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2 RETURNING *',
        [userId, roleId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting user role:', error);
      throw error;
    }
  }
}

module.exports = new UserRolesDao();