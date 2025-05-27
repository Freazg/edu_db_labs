class Task {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.priority = data.priority;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.project_id = data.project_id;
  }

  // Валідація даних завдання
  static validate(taskData) {
    const errors = [];

    if (!taskData.title || taskData.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (taskData.title && taskData.title.length > 255) {
      errors.push('Title must be less than 255 characters');
    }

    if (!taskData.status || taskData.status.trim().length === 0) {
      errors.push('Status is required');
    }

    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (taskData.status && !validStatuses.includes(taskData.status)) {
      errors.push('Status must be one of: pending, in_progress, completed, cancelled');
    }

    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (taskData.priority && !validPriorities.includes(taskData.priority)) {
      errors.push('Priority must be one of: low, medium, high, urgent');
    }

    if (!taskData.project_id || isNaN(taskData.project_id)) {
      errors.push('Valid project_id is required');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Отримати статуси завдань
  static getValidStatuses() {
    return ['pending', 'in_progress', 'completed', 'cancelled'];
  }

  // Отримати пріоритети завдань
  static getValidPriorities() {
    return ['low', 'medium', 'high', 'urgent'];
  }

  // Перевірити, чи завдання завершене
  isCompleted() {
    return this.status === 'completed';
  }

  // Перевірити, чи завдання в процесі виконання
  isInProgress() {
    return this.status === 'in_progress';
  }

  // Перевірити, чи завдання скасоване
  isCancelled() {
    return this.status === 'cancelled';
  }
}

module.exports = Task;