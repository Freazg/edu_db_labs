const db = require('../db');

const tasksDAO = {
  // Отримати всі завдання
  async getAllTasks() {
    try {
      const result = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Отримати завдання за ID
  async getTaskById(id) {
    try {
      const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Отримати завдання за проєктом
  async getTasksByProject(projectId) {
    try {
      const result = await db.query('SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC', [projectId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Створити нове завдання
  async createTask(taskData) {
    const { title, description, priority, status, project_id } = taskData;
    try {
      const result = await db.query(
        'INSERT INTO tasks (title, description, priority, status, project_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, description, priority, status, project_id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Оновити завдання
  async updateTask(id, taskData) {
    const { title, description, priority, status } = taskData;
    try {
      const result = await db.query(
        'UPDATE tasks SET title = $1, description = $2, priority = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
        [title, description, priority, status, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Видалити завдання
  async deleteTask(id) {
    try {
      const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = tasksDAO;