const db = require('../db')

// GET all users
exports.getAll = (callback) => {
  db.query('SELECT * FROM Users', callback)
}

// GET one user by id
exports.getById = (id, callback) => {
  db.query('SELECT * FROM Users WHERE user_id = ?', [id], callback)
}

// GET one user by email
exports.getByEmail = (email, callback) => {
  db.query('SELECT * FROM Users WHERE email = ?', [email], callback)
}

// CREATE one user
exports.create = (data, callback) => {
  db.query('INSERT INTO Users SET ?', data, callback)
}

// UPDATE one user
exports.update = (id, data, callback) => {
  db.query('UPDATE Users SET ? WHERE user_id = ?', [data, id], callback)
}

// DELETE one user
exports.delete = (id, callback) => {
  db.query('DELETE FROM Users WHERE user_id = ?', [id], callback)
}