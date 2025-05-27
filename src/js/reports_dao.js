const db = require('../db');

const reportsDAO = {
  // Отримати всі звіти
  async getAllReports() {
    try {
      const result = await db.query('SELECT * FROM reports ORDER BY generated_at DESC');
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Отримати звіт за ID
  async getReportById(id) {
    try {
      const result = await db.query('SELECT * FROM reports WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Отримати звіти за автором
  async getReportsByAuthor(authorId) {
    try {
      const result = await db.query(
        'SELECT * FROM reports WHERE author_id = $1 ORDER BY generated_at DESC',
        [authorId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Отримати звіти за періодом
  async getReportsByPeriod(startDate, endDate) {
    try {
      const result = await db.query(
        'SELECT * FROM reports WHERE period_start >= $1 AND period_end <= $2 ORDER BY generated_at DESC',
        [startDate, endDate]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Отримати звіти за форматом
  async getReportsByFormat(format) {
    try {
      const result = await db.query(
        'SELECT * FROM reports WHERE format = $1 ORDER BY generated_at DESC',
        [format]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Створити новий звіт
  async createReport(reportData) {
    const { period_start, period_end, format, content_hash, file_path, author_id } = reportData;
    try {
      const result = await db.query(
        'INSERT INTO reports (period_start, period_end, format, content_hash, file_path, author_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [period_start, period_end, format, content_hash, file_path, author_id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Оновити звіт
  async updateReport(id, reportData) {
    const { period_start, period_end, format, content_hash, file_path } = reportData;
    try {
      const result = await db.query(
        'UPDATE reports SET period_start = $1, period_end = $2, format = $3, content_hash = $4, file_path = $5 WHERE id = $6 RETURNING *',
        [period_start, period_end, format, content_hash, file_path, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Видалити звіт
  async deleteReport(id) {
    try {
      const result = await db.query('DELETE FROM reports WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Перевірити існування звіту за хешем
  async getReportByHash(contentHash) {
    try {
      const result = await db.query('SELECT * FROM reports WHERE content_hash = $1', [contentHash]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Отримати останні звіти (за кількістю)
  async getLatestReports(limit = 10) {
    try {
      const result = await db.query(
        'SELECT * FROM reports ORDER BY generated_at DESC LIMIT $1',
        [limit]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = reportsDAO;