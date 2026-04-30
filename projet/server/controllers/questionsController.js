/*const question = require('../models/questionsModel')

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
}*/

const Question = require('../models/questionsModel')

// GET ALL QUESTIONS
exports.getAllQuestions = (req, res) => {
  Question.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// GET ONE QUESTION
exports.getQuestionById = (req, res) => {
  Question.getById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Question not found' })
    }

    res.json(results[0])
  })
}

// GET QUESTIONS BY QUIZ
exports.getQuestionsByQuizId = (req, res) => {
  Question.getByQuizId(req.params.quizId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// CREATE QUESTION
exports.createQuestion = (req, res) => {
  Question.create(req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.status(201).json({
      message: 'Question created successfully',
      question_id: results.insertId,
    })
  })
}

// UPDATE QUESTION
exports.updateQuestion = (req, res) => {
  Question.update(req.params.id, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Question not found' })
    }

    res.json({ message: 'Question updated successfully' })
  })
}

// DELETE QUESTION
exports.deleteQuestion = (req, res) => {
  Question.delete(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Question not found' })
    }

    res.json({ message: 'Question deleted successfully' })
  })
}