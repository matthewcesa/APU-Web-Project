const db = require('../db');

exports.getAll = (callback) => {
    db.query('SELECT * FROM modules', callback);
}

exports.getById = (id, callback) => { 
    db.query('SELECT * FROM modules WHERE id = ? ', [id], callback);
}

exports.create = (data, callback) => {
    db.query('INSERT INTO modules SET ?', [data], callback);
}

exports.update = (id, data, callback) => {
    db.query('UPDATE INTO modules SET ? WHERE id = ?', [data, id], callback);
}

exports.delete = (id, callback) => { 
    db.query('DELETE FROM modules WHERE id = ?', id, callback);
}