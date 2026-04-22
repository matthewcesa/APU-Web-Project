const express = require('express')
const router = express.Router()

const courseController = require('../controllers/coursesController')

// GET ALL course
router.get('/', courseController.getAllCourses)

// GET ONE course
router.get('/:id', courseController.getCourseById)

// CREATE Course
router.post('/', courseController.createCourse)

// UPDATE
router.put('/:id', courseController.updateCourse)

// DELETE Course
router.delete('/:id', courseController.deleteCourse)

module.exports = router;