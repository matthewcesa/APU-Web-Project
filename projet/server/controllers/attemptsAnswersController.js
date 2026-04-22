const attemptAnswer = require('../models/attemptAnswersModel')

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
}