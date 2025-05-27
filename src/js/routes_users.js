const express = require('express');
const bcrypt = require('bcrypt');
const { UserDAO } = require('../dao');
const { User } = require('../models');

const router = express.Router();
const userDAO = new UserDAO();

// Отримати всіх користувачів
router.get('/', async (req, res) => {
  try {
    const users = await userDAO.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Отримати користувача за ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userDAO.findById(parseInt(id));
    
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Створити нового користувача
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    
    // Валідація даних
    const validationErrors = User.validate(userData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    
    // Перевірка, чи користувач з таким email вже існує
    const existingUser = await userDAO.findByEmail(userData.email);
    if (existingUser) {
      return res.status(409).json({ error: 'Користувач з такою електронною адресою вже існує' });
    }
    
    // Хешування паролю
    if (userData.password) {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
      userData.password_hash = await bcrypt.hash(userData.password, saltRounds);
      delete userData.password;
    } else if (!userData.password_hash) {
      return res.status(400).json({ error: 'Пароль є обов\'язковим' });
    }
    
    const user = await userDAO.create(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Оновити дані користувача
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    // Видалити незмінні поля
    delete userData.id;
    delete userData.registration_date;
    
    // Хешування нового паролю, якщо він наданий
    if (userData.password) {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
      userData.password_hash = await bcrypt.hash(userData.password, saltRounds);
      delete userData.password;
    }
    
    const user = await userDAO.update(parseInt(id), userData);
    
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Видалити користувача
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userDAO.delete(parseInt(id));
    
    if (!deleted) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Отримати активних користувачів
router.get('/status/active', async (req, res) => {
  try {
    const users = await userDAO.findActive();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Оновити час останнього входу
router.patch('/:id/login', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userDAO.updateLastLogin(parseInt(id));
    
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;