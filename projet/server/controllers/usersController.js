/* const users = require('../models/usersModel');

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
} */

  const users = require('../models/usersModel');

exports.getAllUsers = (req, res) => {
  users.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  users.getById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);
  });
};

exports.createUser = (req, res) => {
  users.create(req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      message: 'User created successfully',
      id: results.insertId
    });
  });
};

exports.updateUser = (req, res) => {
  users.update(req.params.id, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  });
};

exports.deleteUser = (req, res) => {
  users.delete(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  });
};