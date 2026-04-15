const express = require("express");
const routes = express.Router();
const db = require('../db');

// to get all users
routes.get('/', (req,res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
// to get one particular user
routes.get('/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// to create a new user
routes.post('/', (req, res) => {
    db.query('INSERT INTO users SET ?', [req.body], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// to modify the informations of a certain user 
routes.put('/:id', (req, res) => {
    db.query('UPDATE users SET ? WHERE id = ?', [req.body, req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// to delete a certain user
routes.delete('/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

module.exports = routes;