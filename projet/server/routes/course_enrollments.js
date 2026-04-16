const express = require('express');
const routes = express.Router();

const course_enrollment = require('../controllers/course_enrollmentsController')

// get all course_enrollment
routes.get('/', course_enrollment.getAllcourse_enrollment);

// to get one particular course_enrollment
routes.get('/:id', course_enrollment.getcourse_enrollmenteById);

// to create a new course_enrollment
routes.post('/', course_enrollment.createcourse_enrollment);

// to modify the informations of a certain course_enrollment 
routes.put('/:id', course_enrollment.updatecourse_enrollment);

// to delete a certain course_enrollment
routes.delete('/:id', course_enrollment.deletecourse_enrollment);

module.exports = routes;