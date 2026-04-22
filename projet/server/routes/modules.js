const express = require("express");
const routes = express.Router();

const modulesController = require('../controllers/modulesController');

// get all module
routes.get('/', modulesController.getAllModules);

// to get one particular module
routes.get('/:id', modulesController.getModuleById);

// to create a new module
routes.post('/', modulesController.createModule);

// to modify the informations of a certain module 
routes.put('/:id', modulesController.updateModule);

// to delete a certain module
routes.delete('/:id', modulesController.deleteModule);

module.exports = routes;