const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Тестування підключення
pool.on('connect', () => {
  console.log('База даних підключена успішно');
});

pool.on('error', (err) => {
  console.error('Помилка підключення до бази даних:', err);
});

module.exports = pool;