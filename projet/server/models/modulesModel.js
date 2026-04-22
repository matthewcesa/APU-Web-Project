const db = require('../db');

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
}