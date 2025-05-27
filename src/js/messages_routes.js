const express = require('express');
const router = express.Router();
const messagesDAO = require('../dao/messages_dao');
const Message = require('../models/messages_model');

// GET /messages - Отримати всі повідомлення
router.get('/', async (req, res) => {
  try {
    const messages = await messagesDAO.getAllMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /messages/:id - Отримати повідомлення за ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    const message = await messagesDAO.getMessageById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /messages/user/:userId/received - Отримати повідомлення для користувача
router.get('/user/:userId/received', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const messages = await messagesDAO.getMessagesForUser(userId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching received messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /messages/user/:userId/sent - Отримати повідомлення від користувача
router.get('/user/:userId/sent', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const messages = await messagesDAO.getMessagesFromUser(userId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /messages/user/:userId/unread - Отримати непрочитані повідомлення
router.get('/user/:userId/unread', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const messages = await messagesDAO.getUnreadMessages(userId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /messages/conversation/:user1Id/:user2Id - Отримати діалог між користувачами
router.get('/conversation/:user1Id/:user2Id', async (req, res) => {
  try {
    const user1Id = parseInt(req.params.user1Id);
    const user2Id = parseInt(req.params.user2Id);
    
    if (isNaN(user1Id) || isNaN(user2Id)) {
      return res.status(400).json({ error: 'Invalid user IDs' });
    }

    const messages = await messagesDAO.getConversation(user1Id, user2Id);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /messages - Створити нове повідомлення
router.post('/', async (req, res) => {
  try {
    const validation = Message.validate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const message = await messagesDAO.createMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Referenced user does not exist' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /messages/:id/read - Позначити повідомлення як прочитане
router.put('/:id/read', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    const message = await messagesDAO.markAsRead(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /messages/user/:userId/read-all - Позначити всі повідомлення як прочитані
router.put('/user/:userId/read-all', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const messages = await messagesDAO.markAllAsRead(userId);
    res.json({ 
      message: 'All messages marked as read',
      count: messages.length 
    });
  } catch (error) {
    console.error('Error marking all messages as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /messages/:id - Видалити повідомлення
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    const message = await messagesDAO.deleteMessage(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;