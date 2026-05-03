const Quiz = require('../models/quizzesModel')

// GET ALL QUIZZES
exports.getAllQuizzes = (req, res) => {
  Quiz.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// GET ONE QUIZ
exports.getQuizById = (req, res) => {
  Quiz.getById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    res.json(results[0])
  })
}

// GET QUIZZES BY MODULE
exports.getQuizzesByModuleId = (req, res) => {
  Quiz.getByModuleId(req.params.moduleId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// CREATE QUIZ
exports.createQuiz = (req, res) => {
  Quiz.create(req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz_id: results.insertId,
    })
  })
}

// UPDATE QUIZ
exports.updateQuiz = (req, res) => {
  Quiz.update(req.params.id, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    res.json({ message: 'Quiz updated successfully' })
  })
}

// DELETE QUIZ
exports.deleteQuiz = (req, res) => {
  Quiz.delete(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Quiz not found' })
    }

    res.json({ message: 'Quiz deleted successfully' })
  })
}