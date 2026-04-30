/*const express = require('express')
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

module.exports = router;*/

const express = require('express')
const router = express.Router()

const attemptAnswersController = require('../controllers/attemptAnswersController')

// GET ALL attempt answers
router.get('/', attemptAnswersController.getAllAttemptAnswers)

// GET answers by attempt
router.get('/attempt/:attemptId', attemptAnswersController.getAttemptAnswersByAttemptId)

// GET ONE attempt answer
router.get('/:id', attemptAnswersController.getAttemptAnswerById)

// CREATE attempt answer
router.post('/', attemptAnswersController.createAttemptAnswer)

// UPDATE attempt answer
router.put('/:id', attemptAnswersController.updateAttemptAnswer)

// DELETE attempt answer
router.delete('/:id', attemptAnswersController.deleteAttemptAnswer)

module.exports = router
