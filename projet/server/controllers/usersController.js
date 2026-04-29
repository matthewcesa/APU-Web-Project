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
  const bcrypt = require('bcryptjs')

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

exports.getByEmail = (email, callback) => {
  db.query('SELECT * FROM Users WHERE email = ?', [email], callback);
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

exports.createUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      status
    } = req.body

    if (!first_name || !last_name || !email || !password || !role) {
      return res.status(400).json({
        message: 'Missing required fields'
      })
    }

    const password_hash = await bcrypt.hash(password, 10)

    const newUser = {
      first_name,
      last_name,
      email,
      password_hash,
      role,
      status: status || 'active'
    }

    users.create(newUser, (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({
            message: 'A user with this email already exists'
          })
        }

        return res.status(500).json({
          error: err.message
        })
      }

      res.status(201).json({
        message: 'User created successfully',
        user_id: results.insertId
      })
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

exports.loginUser = (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    })
  }

  users.getByEmail(email, async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const user = results[0]

    const passwordIsValid = await bcrypt.compare(password, user.password_hash)

    if (!passwordIsValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    })
  })
}