const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Endpoint for fetching election results
  router.get('/', (req, res) => {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).send('Start and end dates are required');
    }

    const query = 'SELECT * FROM ElectionResults WHERE date BETWEEN ? AND ?';

    db.query(query, [start, end], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Error querying database');
      }
      res.json(results);
    });
  });

  return router;
};
