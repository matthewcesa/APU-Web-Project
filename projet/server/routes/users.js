const express = require("express");
const routes = express.Router();

const usersController = require('../controllers/usersController');

// get all users
routes.get('/', usersController.getAllUsers);

// to get one particular user
routes.get('/:id', usersController.getUserById);

// to create a new user
routes.post('/', usersController.createUser);

// to modify the informations of a certain user 
routes.put('/:id', usersController.updateUser);

// to delete a certain user
routes.delete('/:id', usersController.deleteUser);

module.exports = routes;