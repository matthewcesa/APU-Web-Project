const express = require('express')
const routes = express.Router()

const modulesController = require('../controllers/modulesController')

// get all modules
routes.get('/', modulesController.getAllModules)

// get modules by course
routes.get('/course/:courseId', modulesController.getModulesByCourseId)

// get one module
routes.get('/:id', modulesController.getModuleById)

// create module
routes.post('/', modulesController.createModule)

// update module
routes.put('/:id', modulesController.updateModule)

// delete module
routes.delete('/:id', modulesController.deleteModule)

module.exports = routes