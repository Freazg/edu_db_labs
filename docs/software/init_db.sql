CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  module VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  deadline TIMESTAMP,
  status VARCHAR(20) NOT NULL CHECK (status IN ('planned', 'active', 'completed', 'archived')),
  owner_id UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(15) NOT NULL CHECK (status IN ('new', 'in_progress', 'completed', 'rejected')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  sender_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  format VARCHAR(10) NOT NULL CHECK (format IN ('pdf', 'csv', 'excel')),
  content_hash VARCHAR(64) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES users(id),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  granted_by UUID REFERENCES users(id),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS project_members (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(10) NOT NULL CHECK (role IN ('member', 'manager', 'observer')),
  assigned_by UUID REFERENCES users(id),
  PRIMARY KEY (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS task_assignments (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID NOT NULL REFERENCES users(id),
  deadline TIMESTAMP,
  PRIMARY KEY (task_id, user_id)
);

INSERT INTO roles (name, description, is_system) VALUES
('Admin', 'Повний доступ до системи', TRUE),
('Project Manager', 'Керування проектами та командами', FALSE),
('Team Member', 'Звичайний учасник команди', FALSE);

INSERT INTO permissions (code, description, module) VALUES
('user:manage', 'Керування користувачами', 'Security'),
('project:create', 'Створення проектів', 'Projects'),
('task:assign', 'Призначення завдань', 'Tasks'),
('report:generate', 'Генерація звітів', 'Reporting');

INSERT INTO users (email, password_hash, first_name, last_name, is_active) VALUES
('admin@company.com', '$2a$10$xJwL5v5Jz5UZJZ5UZJZ5Ue', 'Іван', 'Петренко', TRUE),
('manager@company.com', '$2a$10$xJwL5v5Jz5UZJZ5UZJZ5Ue', 'Марія', 'Іваненко', TRUE),
('user1@company.com', '$2a$10$xJwL5v5Jz5UZJZ5UZJZ5Ue', 'Олексій', 'Сидоренко', TRUE);

INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES
((SELECT id FROM users WHERE email = 'admin@company.com'), (SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM users WHERE email = 'admin@company.com')),
((SELECT id FROM users WHERE email = 'manager@company.com'), (SELECT id FROM roles WHERE name = 'Project Manager'), (SELECT id FROM users WHERE email = 'admin@company.com')),
((SELECT id FROM users WHERE email = 'user1@company.com'), (SELECT id FROM roles WHERE name = 'Team Member'), (SELECT id FROM users WHERE email = 'manager@company.com'));

INSERT INTO role_permissions (role_id, permission_id, granted_by) VALUES
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM permissions WHERE code = 'user:manage'), (SELECT id FROM users WHERE email = 'admin@company.com')),
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM permissions WHERE code = 'project:create'), (SELECT id FROM users WHERE email = 'admin@company.com')),
((SELECT id FROM roles WHERE name = 'Project Manager'), (SELECT id FROM permissions WHERE code = 'task:assign'), (SELECT id FROM users WHERE email = 'admin@company.com'));

INSERT INTO projects (title, description, start_date, deadline, status, owner_id) VALUES
('Розробка нового продукту', 'Створення нового SaaS рішення', '2025-01-15', '2025-06-30', 'active', (SELECT id FROM users WHERE email = 'admin@company.com')),
('Оновлення веб-сайту', 'Редизайн головного сайту компанії', '2025-02-01', '2025-03-15', 'active', (SELECT id FROM users WHERE email = 'manager@company.com'));

INSERT INTO project_members (project_id, user_id, role, assigned_by) VALUES
((SELECT id FROM projects WHERE title = 'Розробка нового продукту'), (SELECT id FROM users WHERE email = 'manager@company.com'), 'manager', (SELECT id FROM users WHERE email = 'admin@company.com')),
((SELECT id FROM projects WHERE title = 'Розробка нового продукту'), (SELECT id FROM users WHERE email = 'user1@company.com'), 'member', (SELECT id FROM users WHERE email = 'manager@company.com'));

INSERT INTO tasks (title, description, priority, status, project_id) VALUES
('Аналіз ринку', 'Провести дослідження конкурентів', 'high', 'new', (SELECT id FROM projects WHERE title = 'Розробка нового продукту')),
('Дизайн інтерфейсу', 'Створити макети головних екранів', 'medium', 'in_progress', (SELECT id FROM projects WHERE title = 'Розробка нового продукту'));

INSERT INTO task_assignments (task_id, user_id, assigned_by, deadline) VALUES
((SELECT id FROM tasks WHERE title = 'Аналіз ринку'), (SELECT id FROM users WHERE email = 'user1@company.com'), (SELECT id FROM users WHERE email = 'manager@company.com'), '2025-02-15'),
((SELECT id FROM tasks WHERE title = 'Дизайн інтерфейсу'), (SELECT id FROM users WHERE email = 'user1@company.com'), (SELECT id FROM users WHERE email = 'manager@company.com'), '2025-02-28');

CREATE INDEX IF NOT EXISTS idx_project_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_task_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_message_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_message_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_report_author ON reports(author_id);
-- Якщо таблиця audit_logs відсутня, ці індекси видалити або закоментувати:
-- CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_logs(user_id);
-- CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_logs(entity_type, entity_id);
