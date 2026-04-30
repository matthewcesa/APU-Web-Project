/* const express = require('express');
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

module.exports = routes; */


const express = require('express')
const routes = express.Router()

const courseEnrollmentController = require('../controllers/course_enrollmentsController')

// GET all enrollments
routes.get('/', courseEnrollmentController.getAllEnrollments)

// GET courses for one student
routes.get('/student/:studentId', courseEnrollmentController.getEnrollmentsByStudent)

// GET students for one course
routes.get('/course/:courseId', courseEnrollmentController.getEnrollmentsByCourse)

// GET one enrollment
routes.get('/:id', courseEnrollmentController.getEnrollmentById)

// CREATE enrollment
routes.post('/', courseEnrollmentController.createEnrollment)

// UPDATE enrollment
routes.put('/:id', courseEnrollmentController.updateEnrollment)

// DELETE enrollment
routes.delete('/:id', courseEnrollmentController.deleteEnrollment)

module.exports = routes