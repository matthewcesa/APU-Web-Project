const db = require('../db')

// GET ALL QUESTIONS
exports.getAll = (callback) => {
  db.query('SELECT * FROM Questions', callback)
}

// GET ONE QUESTION
exports.getById = (id, callback) => {
  db.query('SELECT * FROM Questions WHERE id = ?', [id], callback)
}

// CREATE QUESTION
exports.create = (data, callback) => {
  db.query('INSERT INTO Questions SET ?', data, callback)
}

// UPDATE QUESTION
exports.update = (id, data, callback) => {
  db.query('UPDATE Questions SET ? WHERE id = ?', [data, id], callback)
}

// DELETE QUESTION
exports.delete = (id, callback) => {
  db.query('DELETE FROM Questions WHERE id = ?', [id], callback)
}