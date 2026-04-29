/* const db = require('../db');

//GET all users
exports.getAll = (callback) => {
    db.query('SELECT * FROM Users', callback);                       
}

//GET one user
exports.getById = (id, callback) => { 
    db.query('SELECT * FROM Users WHERE id=?', [id], callback);
}

// CREATE one user
exports.create = (data, callback) => {
    db.query('INSERT INTO Users SET ?', data, callbback);
}

// UPDATE the infor;ations of a certain user
exports.update = (id, data, callback) => {
    db.query('UPDATE Users SET ? WHERE id = ?', [data, id], callback);
}

//DELETE a user
exports.delete = (id, callback) => {
    db.query('DELETE FROM Users WHERE id = ?', [data], callback);
 } */

    const db = require('../db');

// GET all users
exports.getAll = (callback) => {
  db.query('SELECT * FROM Users', callback);
};

// GET one user
exports.getById = (id, callback) => {
  db.query('SELECT * FROM Users WHERE user_id = ?', [id], callback)
}

// CREATE one user
exports.create = (data, callback) => {
  db.query('INSERT INTO Users SET ?', data, callback);
};

// UPDATE one user
exports.update = (id, data, callback) => {
  db.query('UPDATE Users SET ? WHERE user_id = ?', [data, id], callback)
}


// DELETE one user
exports.delete = (id, callback) => {
  db.query('DELETE FROM Users WHERE user_id = ?', [id], callback)
}