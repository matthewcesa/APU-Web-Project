const express = require('express');
const routes = express.Router();
const db = require('../db');

// to get all the course join codes
routes.get('/', (req, res) => {
  db.query('SELECT * FROM course_join_codes', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// to get one particular course join codes
routes.get('/:id', (req, res) => {
    db.query('SELECT * FROM course_join_codes WHERE id = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// to create a new course_join_codes
routes.post('/', (req, res) => {
    db.query('INSERT INTO course_join_codes SET ?', [req.body], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// to modify the informations of a certain course_join_codes 
routes.put('/:id', (req, res) => {
    db.query('UPDATE course_join_codes SET ? WHERE id = ?', [req.body, req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// to delete a certain course_join_codes
routes.delete('/:id', (req, res) => {
    db.query('DELETE FROM course_join_codes WHERE id = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


module.exports = routes;