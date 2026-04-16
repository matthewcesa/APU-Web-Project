const users = require('../models/coursesModel');

exports.getAllUsers = (req,res) => {
    users.getAll((err, results) => { 
        if (err) throw err;
        res.json(results);
    })
}

exports.getUserById = (req, res) => {
  users.getById(req.params.id, (err, results) => {
    if (err) throw err;
    res.json(results[0])
  })
}


exports.createUser = (req, res) => {
  users.create(req.body, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}


exports.updateUser = (req, res) => {
  users.update(req.params.id, req.body, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}


exports.deleteUser = (req, res) => {
  users.delete(req.params.id, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}