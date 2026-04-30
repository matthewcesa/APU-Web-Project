/*const db = require('../db')

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
}*/
const db = require('../db')

// GET ALL
exports.getAll = (callback) => {
  db.query('SELECT * FROM Attempts ORDER BY attempt_id DESC', callback)
}

// GET ONE
exports.getById = (id, callback) => {
  db.query('SELECT * FROM Attempts WHERE attempt_id = ?', [id], callback)
}

// GET ATTEMPTS BY STUDENT
exports.getByStudentId = (studentId, callback) => {
  db.query(
    'SELECT * FROM Attempts WHERE student_id = ? ORDER BY attempt_id DESC',
    [studentId],
    callback
  )
}

// GET ATTEMPTS BY QUIZ
exports.getByQuizId = (quizId, callback) => {
  db.query(
    'SELECT * FROM Attempts WHERE quiz_id = ? ORDER BY attempt_id DESC',
    [quizId],
    callback
  )
}

// GET ATTEMPTS BY STUDENT AND QUIZ
exports.getByStudentAndQuiz = (studentId, quizId, callback) => {
  db.query(
    `
    SELECT *
    FROM Attempts
    WHERE student_id = ?
    AND quiz_id = ?
    ORDER BY attempt_id DESC
    `,
    [studentId, quizId],
    callback
  )
}

// CREATE
exports.create = (data, callback) => {
  db.query('INSERT INTO Attempts SET ?', data, callback)
}

// UPDATE
exports.update = (id, data, callback) => {
  db.query('UPDATE Attempts SET ? WHERE attempt_id = ?', [data, id], callback)
}

// DELETE
exports.delete = (id, callback) => {
  db.query('DELETE FROM Attempts WHERE attempt_id = ?', [id], callback)
}