const express = require('express')
const routes = express.Router()

const usersController = require('../controllers/usersController')

// get all users
routes.get('/', usersController.getAllUsers)

// login user
routes.post('/login', usersController.loginUser)

// get one user
routes.get('/:id', usersController.getUserById)

// create user
routes.post('/', usersController.createUser)

// update user
routes.put('/:id', usersController.updateUser)

// delete user
routes.delete('/:id', usersController.deleteUser)

module.exports = routes