require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', time: rows[0].now });
  } catch {
    res.status(500).json({ error: 'DB connection failed' });
  }
});

// --- USERS ---
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, email, first_name, last_name, is_active FROM users');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

app.post('/users', async (req, res) => {
  const { email, password_hash, first_name, last_name, is_active } = req.body;
  if (!email || !password_hash || !first_name || !last_name) return res.status(400).json({ error: 'Missing fields' });
  try {
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, is_active)
      VALUES ($1, $2, $3, $4, COALESCE($5, true))
      RETURNING id, email, first_name, last_name, is_active
    `;
    const values = [email, password_hash, first_name, last_name, is_active];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, is_active } = req.body;
  try {
    const query = `
      UPDATE users SET
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name),
      is_active = COALESCE($3, is_active)
      WHERE id = $4
      RETURNING id, email, first_name, last_name, is_active
    `;
    const values = [first_name, last_name, is_active, id];
    const { rows, rowCount } = await pool.query(query, values);
    if (rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// --- ROLES ---
app.get('/roles', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM roles');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to get roles' });
  }
});

app.post('/user_roles', async (req, res) => {
  const { user_id, role_id, assigned_by } = req.body;
  if (!user_id || !role_id) return res.status(400).json({ error: 'Missing user_id or role_id' });
  try {
    const query = `
      INSERT INTO user_roles (user_id, role_id, assigned_by)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, role_id) DO NOTHING
      RETURNING user_id, role_id
    `;
    const { rows, rowCount } = await pool.query(query, [user_id, role_id, assigned_by || null]);
    if (rowCount === 0) return res.status(409).json({ error: 'Role already assigned' });
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to assign role' });
  }
});

app.delete('/user_roles', async (req, res) => {
  const { user_id, role_id } = req.body;
  if (!user_id || !role_id) return res.status(400).json({ error: 'Missing user_id or role_id' });
  try {
    const result = await pool.query('DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2', [user_id, role_id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Assignment not found' });
    res.json({ message: 'Role assignment deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete role assignment' });
  }
});

// --- PERMISSIONS ---
app.get('/permissions', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM permissions');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to get permissions' });
  }
});

app.post('/role_permissions', async (req, res) => {
  const { role_id, permission_id, granted_by } = req.body;
  if (!role_id || !permission_id) return res.status(400).json({ error: 'Missing role_id or permission_id' });
  try {
    const query = `
      INSERT INTO role_permissions (role_id, permission_id, granted_by)
      VALUES ($1, $2, $3)
      ON CONFLICT (role_id, permission_id) DO NOTHING
      RETURNING role_id, permission_id
    `;
    const { rows, rowCount } = await pool.query(query, [role_id, permission_id, granted_by || null]);
    if (rowCount === 0) return res.status(409).json({ error: 'Permission already granted' });
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to grant permission' });
  }
});

app.delete('/role_permissions', async (req, res) => {
  const { role_id, permission_id } = req.body;
  if (!role_id || !permission_id) return res.status(400).json({ error: 'Missing role_id or permission_id' });
  try {
    const result = await pool.query('DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2', [role_id, permission_id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Grant not found' });
    res.json({ message: 'Permission grant deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete permission grant' });
  }
});

// --- PROJECTS ---
app.get('/projects', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to get projects' });
  }
});

app.post('/projects', async (req, res) => {
  const { title, description, start_date, deadline, status, owner_id } = req.body;
  if (!title || !start_date || !status || !owner_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const query = `
      INSERT INTO projects (title, description, start_date, deadline, status, owner_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [title, description || null, start_date, deadline || null, status, owner_id];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// --- PROJECT MEMBERS ---
app.post('/project_members', async (req, res) => {
  const { project_id, user_id, role, assigned_by } = req.body;
  if (!project_id || !user_id || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const query = `
      INSERT INTO project_members (project_id, user_id, role, assigned_by)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (project_id, user_id) DO NOTHING
      RETURNING *
    `;
    const values = [project_id, user_id, role, assigned_by || null];
    const { rows, rowCount } = await pool.query(query, values);
    if (rowCount === 0) return res.status(409).json({ error: 'Member already assigned' });
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to assign project member' });
  }
});

app.delete('/project_members', async (req, res) => {
  const { project_id, user_id } = req.body;
  if (!project_id || !user_id) return res.status(400).json({ error: 'Missing project_id or user_id' });
  try {
    const result = await pool.query('DELETE FROM project_members WHERE project_id = $1 AND user_id = $2', [project_id, user_id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Member assignment not found' });
    res.json({ message: 'Project member removed' });
  } catch {
    res.status(500).json({ error: 'Failed to remove project member' });
  }
});

// --- TASKS ---
app.get('/tasks', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

app.post('/tasks', async (req, res) => {
  const { title, description, priority, status, project_id } = req.body;
  if (!title || !priority || !status || !project_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const query = `
      INSERT INTO tasks (title, description, priority, status, project_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [title, description || null, priority, status, project_id];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// --- TASK ASSIGNMENTS ---
app.post('/task_assignments', async (req, res) => {
  const { task_id, user_id, assigned_by, deadline } = req.body;
  if (!task_id || !user_id || !assigned_by) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const query = `
      INSERT INTO task_assignments (task_id, user_id, assigned_by, deadline)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [task_id, user_id, assigned_by, deadline || null];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to assign task' });
  }
});

// --- MESSAGES ---
app.get('/messages', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM messages');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

app.post('/messages', async (req, res) => {
  const { content, sender_id, recipient_id } = req.body;
  if (!content || !sender_id || !recipient_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const query = `
      INSERT INTO messages (content, sender_id, recipient_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [content, sender_id, recipient_id];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// --- REPORTS ---
app.get('/reports', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM reports');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to get reports' });
  }
});

app.post('/reports', async (req, res) => {
  const { period_start, period_end, format, content_hash, file_path, author_id } = req.body;
  if (!period_start || !period_end || !format || !content_hash || !file_path || !author_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const query = `
      INSERT INTO reports (period_start, period_end, format, content_hash, file_path, author_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [period_start, period_end, format, content_hash, file_path, author_id];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create report' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
