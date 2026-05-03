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

// Student JOIN course with code
routes.post('/join', courseEnrollmentController.joinCourseWithCode)

module.exports = routes