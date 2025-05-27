const pool = require('../db');
const { User } = require('../models');

class UserDAO {
  // Отримати всіх користувачів
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM users ORDER BY id');
      return result.rows.map(row => new User(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні користувачів: ${error.message}`);
    }
  }

  // Отримати користувача за ID
  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      throw new Error(`Помилка при отриманні користувача: ${error.message}`);
    }
  }

  // Отримати користувача за email
  async findByEmail(email) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      throw new Error(`Помилка при отриманні користувача: ${error.message}`);
    }
  }

  // Створити нового користувача
  async create(userData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO users (email, password_hash, first_name, last_name, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const values = [
        userData.email,
        userData.password_hash,
        userData.first_name,
        userData.last_name,
        userData.is_active !== undefined ? userData.is_active : true
      ];
      
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return new User(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      if (error.code === '23505') { // Порушення унікальності
        throw new Error('Користувач з такою електронною адресою вже існує');
      }
      throw new Error(`Помилка при створенні користувача: ${error.message}`);
    } finally {
      client.release();
    }
  }

  // Оновити дані користувача
  async update(id, userData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(userData)) {
        if (key !== 'id' && value !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }

      if (setClause.length === 0) {
        throw new Error('Немає даних для оновлення');
      }

      const query = `
        UPDATE users 
        SET ${setClause.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      values.push(id);
      const result = await client.query(query, values);
      await client.query('COMMIT');
      
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при оновленні користувача: ${error.message}`);
    } finally {
      client.release();
    }
  }

  // Видалити користувача
  async delete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      
      return result.rows.length > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Помилка при видаленні користувача: ${error.message}`);
    } finally {
      client.release();
    }
  }

  // Оновити час останнього входу
  async updateLastLogin(id) {
    try {
      const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      throw new Error(`Помилка при оновленні часу входу: ${error.message}`);
    }
  }

  // Отримати активних користувачів
  async findActive() {
    try {
      const result = await pool.query('SELECT * FROM users WHERE is_active = true ORDER BY id');
      return result.rows.map(row => new User(row));
    } catch (error) {
      throw new Error(`Помилка при отриманні активних користувачів: ${error.message}`);
    }
  }
}

module.exports = UserDAO;