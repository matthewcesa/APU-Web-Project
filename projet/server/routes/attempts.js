const express = require('express')
const router = express.Router()

const attemptsController = require('../controllers/AttempsController')

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

module.exports = router;