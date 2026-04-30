/*const express = require('express')
const router = express.Router()

const quizzesController = require('../controllers/quizzesController')

// GET ALL
router.get('/', quizzesController.getAllQuizzes)

// GET ONE
router.get('/:id', quizzesController.getQuizzById)

// CREATE
router.post('/', quizzesController.createQuizz)

// UPDATE
router.put('/:id', quizzesController.updateQuizz)

// DELETE
router.delete('/:id', quizzesController.deleteQuizz)

module.exports = router;*/

const express = require('express')
const router = express.Router()

const quizzesController = require('../controllers/quizzesController')

// GET ALL
router.get('/', quizzesController.getAllQuizzes)

// GET quizzes by module
router.get('/module/:moduleId', quizzesController.getQuizzesByModuleId)

// GET ONE
router.get('/:id', quizzesController.getQuizById)

// CREATE
router.post('/', quizzesController.createQuiz)

// UPDATE
router.put('/:id', quizzesController.updateQuiz)

// DELETE
router.delete('/:id', quizzesController.deleteQuiz)

module.exports = router