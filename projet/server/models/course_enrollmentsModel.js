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

// GET course by join code
exports.getCourseByJoinCode = (joinCode, callback) => {
  db.query('SELECT * FROM Courses WHERE join_code = ?', [joinCode], callback)
}

// CHECK if student is already enrolled
exports.getByStudentAndCourse = (studentId, courseId, callback) => {
  db.query(
    'SELECT * FROM CourseEnrollments WHERE student_id = ? AND course_id = ?',
    [studentId, courseId],
    callback
  )
}