const db = require('../db')

// GET ALL
exports.getAll = (callback) => {
  db.query('SELECT * FROM Attempts', callback)
}

// GET ONE
exports.getById = (id, callback) => {
  db.query('SELECT * FROM Attempts WHERE id = ?', [id], callback)
}

// CREATE
exports.create = (data, callback) => {
  db.query('INSERT INTO Attempts SET ?', data, callback)
}

// UPDATE
exports.update = (id, data, callback) => {
  db.query('UPDATE Attempts SET ? WHERE id = ?', [data, id], callback)
}

// DELETE
exports.delete = (id, callback) => {
  db.query('DELETE FROM Attempts WHERE id = ?', [id], callback)
}