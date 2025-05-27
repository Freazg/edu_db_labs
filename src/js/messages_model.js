class Message {
  constructor(data) {
    this.id = data.id;
    this.content = data.content;
    this.sent_at = data.sent_at;
    this.is_read = data.is_read;
    this.sender_id = data.sender_id;
    this.recipient_id = data.recipient_id;
  }

  // Валідація даних повідомлення
  static validate(messageData) {
    const errors = [];

    if (!messageData.content || messageData.content.trim().length === 0) {
      errors.push('Content is required');
    }

    if (messageData.content && messageData.content.length > 5000) {
      errors.push('Content must be less than 5000 characters');
    }

    if (!messageData.sender_id || isNaN(messageData.sender_id)) {
      errors.push('Valid sender_id is required');
    }

    if (!messageData.recipient_id || isNaN(messageData.recipient_id)) {
      errors.push('Valid recipient_id is required');
    }

    if (messageData.sender_id && messageData.recipient_id && 
        messageData.sender_id === messageData.recipient_id) {
      errors.push('Sender and recipient cannot be the same');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Перевірити, чи повідомлення прочитане
  isRead() {
    return this.is_read === true;
  }

  // Перевірити, чи повідомлення непрочитане
  isUnread() {
    return this.is_read === false;
  }

  // Отримати час відправлення у форматі рядка
  getSentAtString() {
    if (this.sent_at) {
      return new Date(this.sent_at).toLocaleString();
    }
    return null;
  }

  // Отримати превью повідомлення (перші 100 символів)
  getPreview(length = 100) {
    if (!this.content) return '';
    return this.content.length > length 
      ? this.content.substring(0, length) + '...' 
      : this.content;
  }

  // Перевірити, чи повідомлення від конкретного користувача
  isFromUser(userId) {
    return this.sender_id === userId;
  }

  // Перевірити, чи повідомлення для конкретного користувача
  isForUser(userId) {
    return this.recipient_id === userId;
  }
}

module.exports = Message;