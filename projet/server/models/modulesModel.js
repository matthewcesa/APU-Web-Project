/*const db = require('../db');

exports.getAll = (callback) => {
    db.query('SELECT * FROM Modules', callback);
}

exports.getById = (id, callback) => { 
    db.query('SELECT * FROM Modules WHERE id = ? ', [id], callback);
}

exports.create = (data, callback) => {
    db.query('INSERT INTO Modules SET ?', [data], callback);
}

exports.update = (id, data, callback) => {
    db.query('UPDATE INTO Modules SET ? WHERE id = ?', [data, id], callback);
}

exports.delete = (id, callback) => { 
    db.query('DELETE FROM Modules WHERE id = ?', id, callback);
}*/

const db = require('../db')

// GET ALL
exports.getAll = (callback) => {
  db.query('SELECT * FROM Modules ORDER BY position ASC', callback)
}

// GET ONE
exports.getById = (id, callback) => {
  db.query('SELECT * FROM Modules WHERE module_id = ?', [id], callback)
}

// GET MODULES BY COURSE
exports.getByCourseId = (courseId, callback) => {
  db.query(
    'SELECT * FROM Modules WHERE course_id = ? ORDER BY position ASC',
    [courseId],
    callback
  )
}

// CREATE
exports.create = (data, callback) => {
  db.query('INSERT INTO Modules SET ?', data, callback)
}

// UPDATE
exports.update = (id, data, callback) => {
  db.query('UPDATE Modules SET ? WHERE module_id = ?', [data, id], callback)
}

// DELETE
exports.delete = (id, callback) => {
  db.query('DELETE FROM Modules WHERE module_id = ?', [id], callback)
}