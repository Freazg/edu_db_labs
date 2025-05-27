const db = require('../db');

class ProjectMembersDao {
  async findByProjectId(projectId) {
    try {
      const result = await db.query(
        'SELECT pm.*, u.first_name, u.last_name, u.email FROM project_members pm JOIN users u ON pm.user_id = u.id WHERE pm.project_id = $1',
        [projectId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error finding project members:', error);
      throw error;
    }
  }

  async create(projectMember) {
    try {
      const result = await db.query(
        'INSERT INTO project_members (project_id, user_id, role, assigned_by) VALUES ($1, $2, $3, $4) RETURNING *',
        [projectMember.project_id, projectMember.user_id, projectMember.role, projectMember.assigned_by]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating project member:', error);
      throw error;
    }
  }

  async delete(projectId, userId) {
    try {
      const result = await db.query(
        'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING *',
        [projectId, userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting project member:', error);
      throw error;
    }
  }
}

module.exports = new ProjectMembersDao();