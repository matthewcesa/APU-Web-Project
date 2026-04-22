const express = require('express')
const router = express.Router()

const questionOptions = require('../controllers/questionOptionsController')

// GET ALL questionOption
router.get('/', questionOptions.getAllQuestionOptions)

// GET ONE questionOptions
router.get('/:id', questionOptions.getQuestionOptionsById)

// CREATE questionOptions
router.post('/', questionOptions.createQuestionOptions)

// UPDATE questionOptions
router.put('/:id', questionOptions.updateQuestionOptions)

// DELETE questionOptions
router.delete('/:id', questionOptions.deleteQuestionOptions)

module.exports = router;