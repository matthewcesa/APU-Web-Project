const db = require('../db');

//GET all course_enrollments
exports.getAll = (callback) => {
    db.query('SELECT * FROM course_enrollments', callback);                       
}

//GET one course_enrollment
exports.getById = (id, callback) => { 
    db.query('SELECT * FROM course_enrollments WHERE id=?', [id], callback);
}

// CREATE one course_enrollment
exports.create = (data, callback) => {
    db.query('INSERT INTO course_enrollments SET ?', data, callbback);
}

// UPDATE the infor;ations of a certain course_enrollment
exports.update = (id, data, callback) => {
    db.query('UPDATE course_enrollments SEcourse_enrollmentsT ? WHERE id = ?', [data, id], callback);
}

//DELETE a course_enrollment
exports.delete = (id, callback) => {
    db.query('DELETE FROM course_enrollments WHERE id = ?', [data], callback);
 }