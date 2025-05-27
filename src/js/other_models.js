const User = require('./User');

// Модель ролі
class Role {
  constructor({ id, name, description, is_system }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.is_system = is_system;
  }

  static validate(roleData) {
    const errors = [];
    if (!roleData.name || roleData.name.length < 2) {
      errors.push('Назва ролі повинна містити мінімум 2 символи');
    }
    return errors;
  }
}

// Модель дозволу
class Permission {
  constructor({ id, code, description, module }) {
    this.id = id;
    this.code = code;
    this.description = description;
    this.module = module;
  }

  static validate(permissionData) {
    const errors = [];
    if (!permissionData.code || permissionData.code.length < 2) {
      errors.push('Код дозволу повинен містити мінімум 2 символи');
    }
    if (!permissionData.module) {
      errors.push('Модуль є обов\'язковим');
    }
    return errors;
  }
}

// Модель проєкту
class Project {
  constructor({ id, title, description, start_date, deadline, status, owner_id }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.start_date = start_date;
    this.deadline = deadline;
    this.status = status;
    this.owner_id = owner_id;
  }

  static validate(projectData) {
    const errors = [];
    if (!projectData.title || projectData.title.length < 3) {
      errors.push('Назва проєкту повинна містити мінімум 3 символи');
    }
    if (!projectData.status) {
      errors.push('Статус проєкту є обов\'язковим');
    }
    if (!projectData.owner_id) {
      errors.push('Власник проєкту є обов\'язковим');
    }
    return errors;
  }
}

// Модель завдання
class Task {
  constructor({ id, title, description, priority, status, created_at, updated_at, project_id }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.project_id = project_id;
  }

  static validate(taskData) {
    const errors = [];
    if (!taskData.title || taskData.title.length < 3) {
      errors.push('Назва завдання повинна містити мінімум 3 символи');
    }
    if (!taskData.status) {
      errors.push('Статус завдання є обов\'язковим');
    }
    if (!taskData.project_id) {
      errors.push('Проєкт є обов\'язковим');
    }
    return errors;
  }
}

// Модель повідомлення
class Message {
  constructor({ id, content, sent_at, is_read, sender_id, recipient_id }) {
    this.id = id;
    this.content = content;
    this.sent_at = sent_at;
    this.is_read = is_read;
    this.sender_id = sender_id;
    this.recipient_id = recipient_id;
  }

  static validate(messageData) {
    const errors = [];
    if (!messageData.content || messageData.content.length < 1) {
      errors.push('Зміст повідомлення не може бути пустим');
    }
    if (!messageData.sender_id) {
      errors.push('Відправник є обов\'язковим');
    }
    if (!messageData.recipient_id) {
      errors.push('Отримувач є обов\'язковим');
    }
    return errors;
  }
}

// Модель звіту
class Report {
  constructor({ id, generated_at, period_start, period_end, format, content_hash, file_path, author_id }) {
    this.id = id;
    this.generated_at = generated_at;
    this.period_start = period_start;
    this.period_end = period_end;
    this.format = format;
    this.content_hash = content_hash;
    this.file_path = file_path;
    this.author_id = author_id;
  }

  static validate(reportData) {
    const errors = [];
    if (!reportData.period_start) {
      errors.push('Початок періоду є обов\'язковим');
    }
    if (!reportData.period_end) {
      errors.push('Кінець періоду є обов\'язковим');
    }
    if (!reportData.format) {
      errors.push('Формат звіту є обов\'язковим');
    }
    if (!reportData.author_id) {
      errors.push('Автор звіту є обов\'язковим');
    }
    return errors;
  }
}

module.exports = {
  User,
  Role,
  Permission,
  Project,
  Task,
  Message,
  Report
};