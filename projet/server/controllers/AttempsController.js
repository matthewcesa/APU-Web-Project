const attempt = require('../models/attemptsModel')

// GET ALL Attempts
exports.getAllAttempts = (req, res) => {
  attempt.getAll((err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// GET ONE Attempt
exports.getAttemptById = (req, res) => {
  attempt.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results[0])
  })
}

// CREATE Attempt
exports.createAttempt = (req, res) => {
  attempt.create(req.body, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// UPDATE Attempt
exports.updateAttempt = (req, res) => {
  attempt.update(req.params.id, req.body, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// DELETE Attempt
exports.deleteAttempt = (req, res) => {
  attempt.delete(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}