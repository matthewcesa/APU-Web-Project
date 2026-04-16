const db = require('../db');

//GET all users
exports.getAll = (callback) => {
    db.query('SELECT * FROM users', callback);                       
}

//GET one user
exports.getById = (id, callback) => { 
    db.query('SELECT * FROM users WHERE id=?', [id], callback);
}

// CREATE one user
exports.create = (data, callback) => {
    db.query('INSERT INTO users SET ?', data, callbback);
}

// UPDATE the infor;ations of a certain user
exports.update = (id, data, callback) => {
    db.query('UPDATE users SET ? WHERE id = ?', [data, id], callback);
}

//DELETE a user
exports.delete = (id, callback) => {
    db.query('DELETE FROM users WHERE id = ?', [data], callback);
 }