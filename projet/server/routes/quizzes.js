const express = require('express')
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

module.exports = router;