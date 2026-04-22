const db = require('../db')

// GET ALL
exports.getAll = (callback) => {
  db.query('SELECT * FROM Quizzes', callback)
}

// GET ONE
exports.getById = (id, callback) => {
  db.query('SELECT * FROM Quizzes WHERE id = ?', [id], callback)
}

// CREATE
exports.create = (data, callback) => {
  db.query('INSERT INTO Quizzes SET ?', data, callback)
}

// UPDATE
exports.update = (id, data, callback) => {
  db.query('UPDATE Quizzes SET ? WHERE id = ?', [data, id], callback)
}

// DELETE
exports.delete = (id, callback) => {
  db.query('DELETE FROM Quizzes WHERE id = ?', [id], callback)
}