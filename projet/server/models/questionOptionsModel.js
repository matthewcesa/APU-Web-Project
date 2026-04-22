const db = require('../db')

// GET ALL QuestionOptions
exports.getAll = (callback) => {
  db.query('SELECT * FROM QuestionOptions', callback)
}

// GET ONE QuestionOptions
exports.getById = (id, callback) => {
  db.query('SELECT * FROM QuestionOptions WHERE id = ?', [id], callback)
}

// CREATE QuestionOptions
exports.create = (data, callback) => {
  db.query('INSERT INTO QuestionOptions SET ?', data, callback)
}

// UPDATE QuestionOptions
exports.update = (id, data, callback) => {
  db.query('UPDATE QuestionOptions SET ? WHERE id = ?', [data, id], callback)
}

// DELETE QuestionOptions
exports.delete = (id, callback) => {
  db.query('DELETE FROM QuestionOptions WHERE id = ?', [id], callback)
}