/*const db = require('../db')

// GET ALL Attempts
exports.getAll = (callback) => {
  db.query('SELECT * FROM Attempts', callback)
}

// GET ONE Attempts
exports.getById = (id, callback) => {
  db.query('SELECT * FROM Attempts WHERE id = ?', [id], callback)
}

// CREATE Attempts
exports.create = (data, callback) => {
  db.query('INSERT INTO Attempts SET ?', data, callback)
}

// UPDATE Attempts
exports.update = (id, data, callback) => {
  db.query('UPDATE Attempts SET ? WHERE id = ?', [data, id], callback)
}

// DELETE Attempts
exports.delete = (id, callback) => {
  db.query('DELETE FROM Attempts WHERE id = ?', [id], callback)
}*/

const db = require('../db')

// GET ALL enrollments
exports.getAll = (callback) => {
  db.query('SELECT * FROM CourseEnrollments', callback)
}

// GET ONE enrollment
exports.getById = (id, callback) => {
  db.query(
    'SELECT * FROM CourseEnrollments WHERE course_enrollment_id = ?',
    [id],
    callback
  )
}

// GET enrollments by student
exports.getByStudentId = (studentId, callback) => {
  db.query(
    'SELECT * FROM CourseEnrollments WHERE student_id = ?',
    [studentId],
    callback
  )
}

// GET enrollments by course
exports.getByCourseId = (courseId, callback) => {
  db.query(
    'SELECT * FROM CourseEnrollments WHERE course_id = ?',
    [courseId],
    callback
  )
}

// CREATE enrollment
exports.create = (data, callback) => {
  db.query('INSERT INTO CourseEnrollments SET ?', data, callback)
}

// UPDATE enrollment
exports.update = (id, data, callback) => {
  db.query(
    'UPDATE CourseEnrollments SET ? WHERE course_enrollment_id = ?',
    [data, id],
    callback
  )
}

// DELETE enrollment
exports.delete = (id, callback) => {
  db.query(
    'DELETE FROM CourseEnrollments WHERE course_enrollment_id = ?',
    [id],
    callback
  )
}