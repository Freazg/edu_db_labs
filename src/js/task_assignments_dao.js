const db = require('../db');

class TaskAssignmentsDao {
  async findByTaskId(taskId) {
    try {
      const result = await db.query(
        'SELECT ta.*, u.first_name, u.last_name, u.email FROM task_assignments ta JOIN users u ON ta.user_id = u.id WHERE ta.task_id = $1',
        [taskId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error finding task assignments:', error);
      throw error;
    }
  }

  async create(taskAssignment) {
    try {
      const result = await db.query(
        'INSERT INTO task_assignments (task_id, user_id, assigned_by, deadline) VALUES ($1, $2, $3, $4) RETURNING *',
        [taskAssignment.task_id, taskAssignment.user_id, taskAssignment.assigned_by, taskAssignment.deadline]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating task assignment:', error);
      throw error;
    }
  }

  async delete(taskId, userId) {
    try {
      const result = await db.query(
        'DELETE FROM task_assignments WHERE task_id = $1 AND user_id = $2 RETURNING *',
        [taskId, userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting task assignment:', error);
      throw error;
    }
  }
}

module.exports = new TaskAssignmentsDao();