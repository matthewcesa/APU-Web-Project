/*const db = require('../db')

// GET ALL
exports.getAll = (callback) => {
  db.query('SELECT * FROM AttemptAnswers', callback)
}

// GET ONE
exports.getById = (id, callback) => {
  db.query('SELECT * FROM AttemptAnswers WHERE id = ?', [id], callback)
}

// CREATE
exports.create = (data, callback) => {
  db.query('INSERT INTO AttemptAnswers SET ?', data, callback)
}

// UPDATE
exports.update = (id, data, callback) => {
  db.query('UPDATE AttemptAnswers SET ? WHERE id = ?', [data, id], callback)
}

// DELETE
exports.delete = (id, callback) => {
  db.query('DELETE FROM AttemptAnswers WHERE id = ?', [id], callback)
}*/

const db = require('../db')

// GET ALL
exports.getAll = (callback) => {
  db.query('SELECT * FROM AttemptAnswers ORDER BY attempt_answer_id ASC', callback)
}

// GET ONE
exports.getById = (id, callback) => {
  db.query(
    'SELECT * FROM AttemptAnswers WHERE attempt_answer_id = ?',
    [id],
    callback
  )
}

// GET ANSWERS BY ATTEMPT
exports.getByAttemptId = (attemptId, callback) => {
  db.query(
    'SELECT * FROM AttemptAnswers WHERE attempt_id = ? ORDER BY attempt_answer_id ASC',
    [attemptId],
    callback
  )
}

// CREATE
exports.create = (data, callback) => {
  db.query('INSERT INTO AttemptAnswers SET ?', data, callback)
}

// UPDATE
exports.update = (id, data, callback) => {
  db.query(
    'UPDATE AttemptAnswers SET ? WHERE attempt_answer_id = ?',
    [data, id],
    callback
  )
}

// DELETE
exports.delete = (id, callback) => {
  db.query(
    'DELETE FROM AttemptAnswers WHERE attempt_answer_id = ?',
    [id],
    callback
  )
}