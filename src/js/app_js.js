const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Імпорт маршрутів
const usersRoutes = require('./routes/users');
const rolesRoutes = require('./routes/roles');
const permissionsRoutes = require('./routes/permissions');
const projectsRoutes = require('./routes/projects');
const tasksRoutes = require('./routes/tasks');
const messagesRoutes = require('./routes/messages');
const reportsRoutes = require('./routes/reports');
const userRolesRoutes = require('./routes/user_roles');
const rolePermissionsRoutes = require('./routes/role_permissions');
const projectMembersRoutes = require('./routes/project_members');
const taskAssignmentsRoutes = require('./routes/task_assignments');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Маршрути API
app.use('/users', usersRoutes);
app.use('/roles', rolesRoutes);
app.use('/permissions', permissionsRoutes);
app.use('/projects', projectsRoutes);
app.use('/tasks', tasksRoutes);
app.use('/messages', messagesRoutes);
app.use('/reports', reportsRoutes);
app.use('/user_roles', userRolesRoutes);
app.use('/role_permissions', rolePermissionsRoutes);
app.use('/project_members', projectMembersRoutes);
app.use('/task_assignments', taskAssignmentsRoutes);

// Обробка помилок 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Глобальна обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;