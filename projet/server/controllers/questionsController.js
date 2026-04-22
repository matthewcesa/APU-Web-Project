const question = require('../models/questionsModel')

// GET ALL questions
exports.getAllQuestions = (req, res) => {
  question.getAll((err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// GET ONE question
exports.getQuestionById = (req, res) => {
  question.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results[0])
  })
}

// CREATE question
exports.createQuestion = (req, res) => {
  question.create(req.body, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// UPDATE question
exports.updateQuestion = (req, res) => {
  question.update(req.params.id, req.body, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// DELETE question
exports.deleteQuestion = (req, res) => {
  question.delete(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}