const express = require('express')
const router = express.Router()

const attemptsAnswersController = require('../controllers/attemptsAnswersController')

// GET ALL course
router.get('/', attemptsAnswersController.getAllAttemptAnswers)

// GET ONE course
router.get('/:id', attemptsAnswersController.getAttemptAnswersById)

// CREATE Course
router.post('/', attemptsAnswersController.createAttemptAnswers)

// UPDATE
router.put('/:id', attemptsAnswersController.updateAttemptAnswers)

// DELETE Course
router.delete('/:id', attemptsAnswersController.deleteAttemptAnswers)

module.exports = router;