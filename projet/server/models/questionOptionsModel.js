/*const db = require('../db')

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
}*/

const db = require('../db')

// GET ALL QUESTION OPTIONS
exports.getAll = (callback) => {
  db.query('SELECT * FROM QuestionOptions ORDER BY option_id ASC', callback)
}

// GET ONE QUESTION OPTION
exports.getById = (id, callback) => {
  db.query('SELECT * FROM QuestionOptions WHERE option_id = ?', [id], callback)
}

// GET OPTIONS BY QUESTION
exports.getByQuestionId = (questionId, callback) => {
  db.query(
    'SELECT * FROM QuestionOptions WHERE question_id = ? ORDER BY option_id ASC',
    [questionId],
    callback
  )
}

// CREATE QUESTION OPTION
exports.create = (data, callback) => {
  db.query('INSERT INTO QuestionOptions SET ?', data, callback)
}

// UPDATE QUESTION OPTION
exports.update = (id, data, callback) => {
  db.query('UPDATE QuestionOptions SET ? WHERE option_id = ?', [data, id], callback)
}

// DELETE QUESTION OPTION
exports.delete = (id, callback) => {
  db.query('DELETE FROM QuestionOptions WHERE option_id = ?', [id], callback)
}