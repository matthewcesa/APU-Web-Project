const questionOptions = require('../models/questionOptionsModel')

// GET ALL questionOptions
exports.getAllQuestionOptions = (req, res) => {
  questionOptions.getAll((err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// GET ONE questionOptions
exports.getQuestionOptionsById = (req, res) => {
  questionOptions.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results[0])
  })
}

// CREATE questionOptions
exports.createQuestionOptions = (req, res) => {
  questionOptions.create(req.body, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// UPDATE questionOptions
exports.updateQuestionOptions = (req, res) => {
  questionOptions.update(req.params.id, req.body, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// DELETE questionOptions
exports.deleteQuestionOptions = (req, res) => {
  questionOptions.delete(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}