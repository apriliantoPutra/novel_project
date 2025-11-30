// src/routes/index.js
const express= require('express')
const pool = require('../config/db')

const router= express.Router();

// Route uji koneksi DB
router.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'DB connected successfully', time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports= router;
