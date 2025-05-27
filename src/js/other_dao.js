const pool = require('../db');
const { Role, Permission, Project, Task, Message, Report } = require('../models');

// DAO для ролей
class RoleDAO {
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM roles ORDER BY id');
      return result.rows.map(row => new Role(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні ролей: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
      return result.rows.length > 0 ? new Role(result.rows[0]) : null;
    } catch (error) {
      throw new Error(`Помилка при отриманні ролі: ${error.message}`);
    }
  }

  async create(roleData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO roles (name, description, is_system)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      
      const values = [roleData.name, roleData.description, roleData.is_system || false];
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return new Role(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при створенні ролі: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async update(id, roleData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(roleData)) {
        if (key !== 'id' && value !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }

      const query = `
        UPDATE roles 
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      values.push(id);
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return result.rows.length > 0 ? new Role(result.rows[0]) : null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при оновленні ролі: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query('DELETE FROM roles WHERE id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      
      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при видаленні ролі: ${error.message}`);
    } finally {
      client.release();
    }
  }
}

// DAO для дозволів
class PermissionDAO {
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM permissions ORDER BY module, code');
      return result.rows.map(row => new Permission(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні дозволів: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM permissions WHERE id = $1', [id]);
      return result.rows.length > 0 ? new Permission(result.rows[0]) : null;
    } catch (error) {
      throw new Error(`Помилка при отриманні дозволу: ${error.message}`);
    }
  }

  async create(permissionData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO permissions (code, description, module)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      
      const values = [permissionData.code, permissionData.description, permissionData.module];
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return new Permission(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при створенні дозволу: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async update(id, permissionData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(permissionData)) {
        if (key !== 'id' && value !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }

      const query = `
        UPDATE permissions 
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      values.push(id);
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return result.rows.length > 0 ? new Permission(result.rows[0]) : null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при оновленні дозволу: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query('DELETE FROM permissions WHERE id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      
      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при видаленні дозволу: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async findByModule(module) {
    try {
      const result = await pool.query('SELECT * FROM permissions WHERE module = $1 ORDER BY code', [module]);
      return result.rows.map(row => new Permission(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні дозволів модуля: ${error.message}`);
    }
  }
}

// DAO для проєктів
class ProjectDAO {
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM projects ORDER BY id');
      return result.rows.map(row => new Project(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні проєктів: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
      return result.rows.length > 0 ? new Project(result.rows[0]) : null;
    } catch (error) {
      throw new Error(`Помилка при отриманні проєкту: ${error.message}`);
    }
  }

  async create(projectData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
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
      
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return new Project(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при створенні проєкту: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async update(id, projectData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(projectData)) {
        if (key !== 'id' && value !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }

      const query = `
        UPDATE projects 
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      values.push(id);
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return result.rows.length > 0 ? new Project(result.rows[0]) : null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при оновленні проєкту: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      
      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при видаленні проєкту: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async findByOwner(ownerId) {
    try {
      const result = await pool.query('SELECT * FROM projects WHERE owner_id = $1 ORDER BY id', [ownerId]);
      return result.rows.map(row => new Project(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні проєктів власника: ${error.message}`);
    }
  }

  async findByStatus(status) {
    try {
      const result = await pool.query('SELECT * FROM projects WHERE status = $1 ORDER BY id', [status]);
      return result.rows.map(row => new Project(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні проєктів за статусом: ${error.message}`);
    }
  }
}

// DAO для завдань
class TaskDAO {
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM tasks ORDER BY id');
      return result.rows.map(row => new Task(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні завдань: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
      return result.rows.length > 0 ? new Task(result.rows[0]) : null;
    } catch (error) {
      throw new Error(`Помилка при отриманні завдання: ${error.message}`);
    }
  }

  async create(taskData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO tasks (title, description, priority, status, project_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const values = [
        taskData.title,
        taskData.description,
        taskData.priority,
        taskData.status,
        taskData.project_id
      ];
      
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return new Task(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при створенні завдання: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async update(id, taskData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(taskData)) {
        if (key !== 'id' && value !== undefined) {
          if (key === 'updated_at') {
            setClause.push(`${key} = CURRENT_TIMESTAMP`);
          } else {
            setClause.push(`${key} = ${paramIndex}`);
            values.push(value);
            paramIndex++;
          }
        }
      }

      // Завжди оновлюємо updated_at
      if (!setClause.some(clause => clause.includes('updated_at'))) {
        setClause.push('updated_at = CURRENT_TIMESTAMP');
      }

      const query = `
        UPDATE tasks 
        SET ${setClause.join(', ')}
        WHERE id = ${paramIndex}
        RETURNING *
      `;
      
      values.push(id);
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return result.rows.length > 0 ? new Task(result.rows[0]) : null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при оновленні завдання: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      
      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при видаленні завдання: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async findByProject(projectId) {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE project_id = $1 ORDER BY id', [projectId]);
      return result.rows.map(row => new Task(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні завдань проєкту: ${error.message}`);
    }
  }

  async findByStatus(status) {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE status = $1 ORDER BY id', [status]);
      return result.rows.map(row => new Task(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні завдань за статусом: ${error.message}`);
    }
  }
}

// DAO для повідомлень
class MessageDAO {
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM messages ORDER BY sent_at DESC');
      return result.rows.map(row => new Message(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні повідомлень: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM messages WHERE id = $1', [id]);
      return result.rows.length > 0 ? new Message(result.rows[0]) : null;
    } catch (error) {
      throw new Error(`Помилка при отриманні повідомлення: ${error.message}`);
    }
  }

  async create(messageData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO messages (content, sender_id, recipient_id, is_read)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      const values = [
        messageData.content,
        messageData.sender_id,
        messageData.recipient_id,
        messageData.is_read || false
      ];
      
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return new Message(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при створенні повідомлення: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async update(id, messageData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(messageData)) {
        if (key !== 'id' && value !== undefined) {
          setClause.push(`${key} = ${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }

      const query = `
        UPDATE messages 
        SET ${setClause.join(', ')}
        WHERE id = ${paramIndex}
        RETURNING *
      `;
      
      values.push(id);
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return result.rows.length > 0 ? new Message(result.rows[0]) : null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при оновленні повідомлення: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query('DELETE FROM messages WHERE id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      
      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при видаленні повідомлення: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async findBySender(senderId) {
    try {
      const result = await pool.query('SELECT * FROM messages WHERE sender_id = $1 ORDER BY sent_at DESC', [senderId]);
      return result.rows.map(row => new Message(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні повідомлень відправника: ${error.message}`);
    }
  }

  async findByRecipient(recipientId) {
    try {
      const result = await pool.query('SELECT * FROM messages WHERE recipient_id = $1 ORDER BY sent_at DESC', [recipientId]);
      return result.rows.map(row => new Message(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні повідомлень отримувача: ${error.message}`);
    }
  }

  async markAsRead(id) {
    try {
      const query = 'UPDATE messages SET is_read = true WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? new Message(result.rows[0]) : null;
    } catch (error) {
      throw new Error(`Помилка при позначенні повідомлення як прочитаного: ${error.message}`);
    }
  }
}

// DAO для звітів
class ReportDAO {
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM reports ORDER BY generated_at DESC');
      return result.rows.map(row => new Report(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні звітів: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
      return result.rows.length > 0 ? new Report(result.rows[0]) : null;
    } catch (error) {
      throw new Error(`Помилка при отриманні звіту: ${error.message}`);
    }
  }

  async create(reportData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO reports (period_start, period_end, format, content_hash, file_path, author_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      
      const values = [
        reportData.period_start,
        reportData.period_end,
        reportData.format,
        reportData.content_hash,
        reportData.file_path,
        reportData.author_id
      ];
      
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return new Report(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при створенні звіту: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async update(id, reportData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(reportData)) {
        if (key !== 'id' && value !== undefined) {
          setClause.push(`${key} = ${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }

      const query = `
        UPDATE reports 
        SET ${setClause.join(', ')}
        WHERE id = ${paramIndex}
        RETURNING *
      `;
      
      values.push(id);
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return result.rows.length > 0 ? new Report(result.rows[0]) : null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при оновленні звіту: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query('DELETE FROM reports WHERE id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      
      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при видаленні звіту: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async findByAuthor(authorId) {
    try {
      const result = await pool.query('SELECT * FROM reports WHERE author_id = $1 ORDER BY generated_at DESC', [authorId]);
      return result.rows.map(row => new Report(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні звітів автора: ${error.message}`);
    }
  }

  async findByPeriod(startDate, endDate) {
    try {
      const result = await pool.query(
        'SELECT * FROM reports WHERE period_start >= $1 AND period_end <= $2 ORDER BY generated_at DESC', 
        [startDate, endDate]
      );
      return result.rows.map(row => new Report(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні звітів за період: ${error.message}`);
    }
  }
}

// DAO для зв'язкових таблиць
class RelationDAO {
  // Користувач-Роль
  async assignUserRole(userId, roleId, assignedBy) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO user_roles (user_id, role_id, assigned_by)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, role_id) DO NOTHING
        RETURNING *
      `;
      
      const result = await client.query(query, [userId, roleId, assignedBy]);
      await client.query('COMMIT');
      
      return result.rows[0] || null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при призначенні ролі: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async removeUserRole(userId, roleId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(
        'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2 RETURNING *',
        [userId, roleId]
      );
      
      await client.query('COMMIT');
      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при скасуванні ролі: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async getUserRoles(userId) {
    try {
      const query = `
        SELECT r.*, ur.assigned_at, ur.assigned_by
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1
        ORDER BY r.name
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Помилка при отриманні ролей користувача: ${error.message}`);
    }
  }

  // Роль-Дозвіл
  async grantRolePermission(roleId, permissionId, grantedBy) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO role_permissions (role_id, permission_id, granted_by)
        VALUES ($1, $2, $3)
        ON CONFLICT (role_id, permission_id) DO NOTHING
        RETURNING *
      `;
      
      const result = await client.query(query, [roleId, permissionId, grantedBy]);
      await client.query('COMMIT');
      
      return result.rows[0] || null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при наданні дозволу: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async revokeRolePermission(roleId, permissionId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(
        'DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2 RETURNING *',
        [roleId, permissionId]
      );
      
      await client.query('COMMIT');
      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при скасуванні дозволу: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async getRolePermissions(roleId) {
    try {
      const query = `
        SELECT p.*, rp.granted_at, rp.granted_by
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        WHERE rp.role_id = $1
        ORDER BY p.module, p.code
      `;
      
      const result = await pool.query(query, [roleId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Помилка при отриманні дозволів ролі: ${error.message}`);
    }
  }

  // Проєкт-Учасник
  async addProjectMember(projectId, userId, role, assignedBy) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO project_members (project_id, user_id, role, assigned_by)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (project_id, user_id) DO UPDATE SET
          role = EXCLUDED.role,
          assigned_by = EXCLUDED.assigned_by,
          joined_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      
      const result = await client.query(query, [projectId, userId, role, assignedBy]);
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при додаванні учасника: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async removeProjectMember(projectId, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(
        'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING *',
        [projectId, userId]
      );
      
      await client.query('COMMIT');
      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при видаленні учасника: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async getProjectMembers(projectId) {
    try {
      const query = `
        SELECT u.*, pm.role, pm.joined_at, pm.assigned_by
        FROM users u
        JOIN project_members pm ON u.id = pm.user_id
        WHERE pm.project_id = $1
        ORDER BY u.first_name, u.last_name
      `;
      
      const result = await pool.query(query, [projectId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Помилка при отриманні учасників проєкту: ${error.message}`);
    }
  }

  // Завдання-Виконавець
  async assignTask(taskId, userId, assignedBy, deadline) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO task_assignments (task_id, user_id, assigned_by, deadline)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (task_id, user_id) DO UPDATE SET
          assigned_by = EXCLUDED.assigned_by,
          deadline = EXCLUDED.deadline,
          assigned_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      
      const result = await client.query(query, [taskId, userId, assignedBy, deadline]);
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при призначенні завдання: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async unassignTask(taskId, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(
        'DELETE FROM task_assignments WHERE task_id = $1 AND user_id = $2 RETURNING *',
        [taskId, userId]
      );
      
      await client.query('COMMIT');
      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при скасуванні призначення: ${error.message}`);
    } finally {
      client.release();
    }
  }

  async getTaskAssignments(taskId) {
    try {
      const query = `
        SELECT u.*, ta.assigned_at, ta.assigned_by, ta.deadline
        FROM users u
        JOIN task_assignments ta ON u.id = ta.user_id
        WHERE ta.task_id = $1
        ORDER BY u.first_name, u.last_name
      `;
      
      const result = await pool.query(query, [taskId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Помилка при отриманні призначень завдання: ${error.message}`);
    }
  }
}

const UserDAO = require('./UserDAO');

module.exports = {
  UserDAO,
  RoleDAO,
  PermissionDAO,
  ProjectDAO,
  TaskDAO,
  MessageDAO,
  ReportDAO,
  RelationDAO
};