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
