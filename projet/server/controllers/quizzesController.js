const quizz = require('../models/quizzesModel')

// GET ALL quizzes
quizz.getAllQuizzes = (req, res) => {
  Course.getAll((err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// GET ONE quizz
exports.getQuizzById = (req, res) => {
  quizz.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results[0])
  })
}

// CREATE quizz
exports.createQuizz = (req, res) => {
  quizz.create(req.body, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// UPDATE quizz
exports.updateQuizz = (req, res) => {
  quizz.update(req.params.id, req.body, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// DELETE quizz
exports.deleteQuizz = (req, res) => {
  quizz.delete(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}