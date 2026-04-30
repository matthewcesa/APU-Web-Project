/*const express = require('express')
const router = express.Router()

const attemptsController = require('../controllers/attempsController')

// GET ALL course
router.get('/', attemptsController.getAllAttempts)

// GET ONE course
router.get('/:id', attemptsController.getAttemptById)

// CREATE Course
router.post('/', attemptsController.createAttempt)

// UPDATE
router.put('/:id', attemptsController.updateAttempt)

// DELETE Course
router.delete('/:id', attemptsController.deleteAttempt)

module.exports = router;*/

const express = require('express')
const router = express.Router()

const attemptsController = require('../controllers/attemptsController')

// GET ALL attempts
router.get('/', attemptsController.getAllAttempts)

// GET attempts by student
router.get('/student/:studentId', attemptsController.getAttemptsByStudentId)

// GET attempts by quiz
router.get('/quiz/:quizId', attemptsController.getAttemptsByQuizId)

// GET attempts by student and quiz
router.get('/student/:studentId/quiz/:quizId', attemptsController.getAttemptsByStudentAndQuiz)

// GET ONE attempt
router.get('/:id', attemptsController.getAttemptById)

// CREATE attempt
router.post('/', attemptsController.createAttempt)

// UPDATE attempt
router.put('/:id', attemptsController.updateAttempt)

// DELETE attempt
router.delete('/:id', attemptsController.deleteAttempt)

module.exports = router