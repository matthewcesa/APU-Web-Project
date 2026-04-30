/*const express = require('express')
const router = express.Router()

const questionsController = require('../controllers/questionsController')

// GET ALL questions
router.get('/', questionsController.getAllQuestions)

// GET ONE question
router.get('/:id', questionsController.getQuestionById)

// CREATE question
router.post('/', questionsController.createQuestion)

// UPDATE question
router.put('/:id', questionsController.updateQuestion)

// DELETE question
router.delete('/:id', questionsController.deleteQuestion)

module.exports = router;*/

const express = require('express')
const router = express.Router()

const questionsController = require('../controllers/questionsController')

// GET ALL questions
router.get('/', questionsController.getAllQuestions)

// GET questions by quiz
router.get('/quiz/:quizId', questionsController.getQuestionsByQuizId)

// GET ONE question
router.get('/:id', questionsController.getQuestionById)

// CREATE question
router.post('/', questionsController.createQuestion)

// UPDATE question
router.put('/:id', questionsController.updateQuestion)

// DELETE question
router.delete('/:id', questionsController.deleteQuestion)

module.exports = router