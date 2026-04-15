const express = require('express');
const routes = express.Router();
const db = require('../db');

//to get all the users 
routes.get('/', (req, res) => {
  db.query('SELECT * FROM courses', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
// to get one particular course
routes.get('/:id', (req, res) => {
    db.query('SELECT * FROM courses WHERE id = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// to create a new course
routes.post('/', (req, res) => {
    db.query('INSERT INTO courses SET ?', [req.body], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// to modify the informations of a certain course 
routes.put('/:id', (req, res) => {
    db.query('UPDATE courses SET ? WHERE id = ?', [req.body, req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// to delete a certain course
routes.delete('/:id', (req, res) => {
    db.query('DELETE FROM courses WHERE id = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


module.exports = routes;