const express = require('express');
const routes = express.Router();
const db = require('../db');

routes.get('/', (req, res) => {
  db.query('SELECT * FROM courses', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

module.exports = routes;''