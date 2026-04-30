/*const attemptAnswer = require('../models/attemptAnswersModel')

// GET ALL attemptAnswer
exports.getAllAttemptAnswers = (req, res) => {
  attemptAnswer.getAll((err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// GET ONE attemptAnswer
exports.getAttemptAnswersById = (req, res) => {
  attemptAnswer.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results[0])
  })
}

// CREATE attemptAnswer
exports.createAttemptAnswers  = (req, res) => {
  attemptAnswer.create(req.body, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// UPDATE attemptAnswer
exports.updateAttemptAnswers  = (req, res) => {
  attemptAnswer.update(req.params.id, req.body, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// DELETE attemptAnswer
exports.deleteAttemptAnswers  = (req, res) => {
  attemptAnswer.delete(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}*/

const AttemptAnswer = require('../models/attemptAnswersModel')

// GET ALL ATTEMPT ANSWERS
exports.getAllAttemptAnswers = (req, res) => {
  AttemptAnswer.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// GET ONE ATTEMPT ANSWER
exports.getAttemptAnswerById = (req, res) => {
  AttemptAnswer.getById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Attempt answer not found' })
    }

    res.json(results[0])
  })
}

// GET ANSWERS BY ATTEMPT
exports.getAttemptAnswersByAttemptId = (req, res) => {
  AttemptAnswer.getByAttemptId(req.params.attemptId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// CREATE ATTEMPT ANSWER
exports.createAttemptAnswer = (req, res) => {
  AttemptAnswer.create(req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.status(201).json({
      message: 'Attempt answer created successfully',
      attempt_answer_id: results.insertId,
    })
  })
}

// UPDATE ATTEMPT ANSWER
exports.updateAttemptAnswer = (req, res) => {
  AttemptAnswer.update(req.params.id, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Attempt answer not found' })
    }

    res.json({ message: 'Attempt answer updated successfully' })
  })
}

// DELETE ATTEMPT ANSWER
exports.deleteAttemptAnswer = (req, res) => {
  AttemptAnswer.delete(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Attempt answer not found' })
    }

    res.json({ message: 'Attempt answer deleted successfully' })
  })
}