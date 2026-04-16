const db = require('../db');

//GET all course join codes
exports.getAll = (callback) => {
    db.query('SELECT * FROM course_join_codes', callback);                       
}

//GET one course_join_codes
exports.getById = (id, callback) => { 
    db.query('SELECT * FROM course_join_codes WHERE id=?', [id], callback);
}

// CREATE one course_join_codes
exports.create = (data, callback) => {
    db.query('INSERT INTO course_join_codes SET ?', data, callbback);
}

// UPDATE the infor;ations of a certain course_join_codes
exports.update = (id, data, callback) => {
    db.query('UPDATE course_join_codes SET ? WHERE id = ?', [data, id], callback);
}

//DELETE a course_join_codes
exports.delete = (id, callback) => {
    db.query('DELETE FROM course_join_codes WHERE id = ?', [data], callback);
 }