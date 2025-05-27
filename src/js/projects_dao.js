const db = require('../db');

class ProjectsDao {
  async getAll() {
    const query = `
      SELECT p.*, u.first_name, u.last_name, u.email as owner_email
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      ORDER BY p.start_date DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  async getById(id) {
    const query = `
      SELECT p.*, u.first_name, u.last_name, u.email as owner_email
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async getByOwnerId(ownerId) {
    const query = 'SELECT * FROM projects WHERE owner_id = $1 ORDER BY start_date DESC';
    const result = await db.query(query, [ownerId]);
    return result.rows;
  }

  async getByStatus(status) {
    const query = `
      SELECT p.*, u.first_name, u.last_name, u.email as owner_email
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.status = $1
      ORDER BY p.start_date DESC
    `;
    const result = await db.query(query, [status]);
    return result.rows;
  }

  async create(projectData) {
    const query = `
      INSERT INTO projects (title, description, start_date, deadline, status, owner_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      projectData.title,
      projectData.description,
      projectData.start_date,
      projectData.deadline,
      projectData.status,
      projectData.owner_id
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async update(id, projectData) {
    const query = `
      UPDATE projects 
      SET title = $2, description = $3, start_date = $4, deadline = $5, status = $6, owner_id = $7
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      projectData.title,
      projectData.description,
      projectData.start_date,
      projectData.deadline,
      projectData.status,
      projectData.owner_id
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM projects WHERE id = $1';
    await db.query(query, [id]);
  }

  async getProjectsByUserId(userId) {
    const query = `
      SELECT DISTINCT p.*, u.first_name, u.last_name, u.email as owner_email
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN project_members pm ON p.id = pm.project_id
      WHERE p.owner_id = $1 OR pm.user_id = $1
      ORDER BY p.start_date DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }
}

module.exports = new ProjectsDao();