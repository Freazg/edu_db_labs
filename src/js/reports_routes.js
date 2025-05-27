const express = require('express');
const router = express.Router();
const reportsDao = require('../dao/reports_dao');

// Отримати всі звіти
router.get('/', async (req, res) => {
  try {
    const reports = await reportsDao.findAll();
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Отримати звіт за ID
router.get('/:id', async (req, res) => {
  try {
    const report = await reportsDao.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Створити новий звіт
router.post('/', async (req, res) => {
  try {
    const newReport = await reportsDao.create(req.body);
    res.status(201).json(newReport);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Оновити звіт
router.put('/:id', async (req, res) => {
  try {
    const updatedReport = await reportsDao.update(req.params.id, req.body);
    if (!updatedReport) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Видалити звіт
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await reportsDao.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;