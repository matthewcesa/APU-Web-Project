/*const express = require('express')
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

module.exports = router;*/

const express = require('express')
const router = express.Router()

const questionOptionsController = require('../controllers/questionOptionsController')

// GET ALL question options
router.get('/', questionOptionsController.getAllQuestionOptions)

// GET options by question
router.get('/question/:questionId', questionOptionsController.getQuestionOptionsByQuestionId)

// GET ONE question option
router.get('/:id', questionOptionsController.getQuestionOptionById)

// CREATE question option
router.post('/', questionOptionsController.createQuestionOption)

// UPDATE question option
router.put('/:id', questionOptionsController.updateQuestionOption)

// DELETE question option
router.delete('/:id', questionOptionsController.deleteQuestionOption)

module.exports = router