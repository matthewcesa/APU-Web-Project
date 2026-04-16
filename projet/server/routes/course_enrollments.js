const express = require('express');
const routes = express.Router();
const db = require('../db');

//to get all the enrollments of courses
routes.get('/', (req, res) => {
  db.query('SELECT * FROM course_enrollments', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// to get one particular enrollment of course
routes.get('/:id', (req, res) => {
    db.query('SELECT * FROM course_enrollments WHERE id = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// to create a new enrollment of course
routes.post('/', (req, res) => {
    db.query('INSERT INTO course_enrollments SET ?', [req.body], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// to modify the informations of a certain enrollment of course 
routes.put('/:id', (req, res) => {
    db.query('UPDATE course_enrollments SET ? WHERE id = ?', [req.body, req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// to delete a certain enrollment of course
routes.delete('/:id', (req, res) => {
    db.query('DELETE FROM course_enrollments WHERE id = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

module.exports = routes;