const db = require('../db');

const messagesDAO = {
  // Отримати всі повідомлення
  async getAllMessages() {
    try {
      const result = await db.query('SELECT * FROM messages ORDER BY sent_at DESC');
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Отримати повідомлення за ID
  async getMessageById(id) {
    try {
      const result = await db.query('SELECT * FROM messages WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Отримати повідомлення для користувача (отримані)
  async getMessagesForUser(userId) {
    try {
      const result = await db.query(
        'SELECT * FROM messages WHERE recipient_id = $1 ORDER BY sent_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Отримати повідомлення від користувача (відправлені)
  async getMessagesFromUser(userId) {
    try {
      const result = await db.query(
        'SELECT * FROM messages WHERE sender_id = $1 ORDER BY sent_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Отримати непрочитані повідомлення користувача
  async getUnreadMessages(userId) {
    try {
      const result = await db.query(
        'SELECT * FROM messages WHERE recipient_id = $1 AND is_read = FALSE ORDER BY sent_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Створити нове повідомлення
  async createMessage(messageData) {
    const { content, sender_id, recipient_id } = messageData;
    try {
      const result = await db.query(
        'INSERT INTO messages (content, sender_id, recipient_id) VALUES ($1, $2, $3) RETURNING *',
        [content, sender_id, recipient_id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Позначити повідомлення як прочитане
  async markAsRead(id) {
    try {
      const result = await db.query(
        'UPDATE messages SET is_read = TRUE WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Позначити всі повідомлення користувача як прочитані
  async markAllAsRead(userId) {
    try {
      const result = await db.query(
        'UPDATE messages SET is_read = TRUE WHERE recipient_id = $1 AND is_read = FALSE RETURNING *',
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Видалити повідомлення
  async deleteMessage(id) {
    try {
      const result = await db.query('DELETE FROM messages WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Отримати діалог між двома користувачами
  async getConversation(user1Id, user2Id) {
    try {
      const result = await db.query(
        'SELECT * FROM messages WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1) ORDER BY sent_at ASC',
        [user1Id, user2Id]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = messagesDAO;