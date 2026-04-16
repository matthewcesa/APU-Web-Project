const express = require('express')
const router = express.Router()

const courseController = require('../controllers/courseController')

// GET ALL
router.get('/', courseController.getAllCourses)

// GET ONE
router.get('/:id', courseController.getCourseById)

// CREATE
router.post('/', courseController.createCourse)

// UPDATE
router.put('/:id', courseController.updateCourse)

// DELETE
router.delete('/:id', courseController.deleteCourse)

module.exports = router;