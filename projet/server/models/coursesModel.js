const db = require('../db')

// GET ALL
exports.getAll = (callback) => {
  db.query('SELECT * FROM courses', callback)
}

// GET ONE
exports.getById = (id, callback) => {
  db.query('SELECT * FROM courses WHERE id = ?', [id], callback)
}

// CREATE
exports.create = (data, callback) => {
  db.query('INSERT INTO courses SET ?', data, callback)
}

// UPDATE
exports.update = (id, data, callback) => {
  db.query('UPDATE courses SET ? WHERE id = ?', [data, id], callback)
}

// DELETE
exports.delete = (id, callback) => {
  db.query('DELETE FROM courses WHERE id = ?', [id], callback)
}