const express = require('express')
const router = express.Router()

const attemptsAnswersController = require('../controllers/attemptsAnswersController')

// GET ALL course
router.get('/', attemptsAnswersController.getC)

// GET ONE course
router.get('/:id', attemptsAnswersController.getCourseById)

// CREATE Course
router.post('/', attemptsAnswersController.createCourse)

// UPDATE
router.put('/:id', attemptsAnswersController.updateCourse)

// DELETE Course
router.delete('/:id', attemptsAnswersController.deleteCourse)

module.exports = router;