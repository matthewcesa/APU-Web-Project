/* const db = require('../db')

// GET ALL
exports.getAll = (callback) => {
  db.query('SELECT * FROM Courses', callback)
}

// GET ONE
exports.getById = (id, callback) => {
  db.query('SELECT * FROM Courses WHERE id = ?', [id], callback)
}

// CREATE
exports.create = (data, callback) => {
  db.query('INSERT INTO Courses SET ?', data, callback)
}

// UPDATE
exports.update = (id, data, callback) => {
  db.query('UPDATE Courses SET ? WHERE id = ?', [data, id], callback)
}

// DELETE
exports.delete = (id, callback) => {
  db.query('DELETE FROM Courses WHERE id = ?', [id], callback)
} */

const db = require('../db')

// GET ALL
exports.getAll = (callback) => {
  db.query('SELECT * FROM Courses ORDER BY created_at DESC', callback)
}

// GET ONE
exports.getById = (id, callback) => {
  db.query('SELECT * FROM Courses WHERE course_id = ?', [id], callback)
}

// CREATE
exports.create = (data, callback) => {
  db.query('INSERT INTO Courses SET ?', data, callback)
}

// UPDATE
exports.update = (id, data, callback) => {
  db.query('UPDATE Courses SET ? WHERE course_id = ?', [data, id], callback)
}

// DELETE
exports.delete = (id, callback) => {
  db.query('DELETE FROM Courses WHERE course_id = ?', [id], callback)
}