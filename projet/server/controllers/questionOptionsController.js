/*const questionOptions = require('../models/questionOptionsModel')

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
}*/

const QuestionOption = require('../models/questionOptionsModel')

// GET ALL QUESTION OPTIONS
exports.getAllQuestionOptions = (req, res) => {
  QuestionOption.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// GET ONE QUESTION OPTION
exports.getQuestionOptionById = (req, res) => {
  QuestionOption.getById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Question option not found' })
    }

    res.json(results[0])
  })
}

// GET OPTIONS BY QUESTION
exports.getQuestionOptionsByQuestionId = (req, res) => {
  QuestionOption.getByQuestionId(req.params.questionId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// CREATE QUESTION OPTION
exports.createQuestionOption = (req, res) => {
  QuestionOption.create(req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.status(201).json({
      message: 'Question option created successfully',
      option_id: results.insertId,
    })
  })
}

// UPDATE QUESTION OPTION
exports.updateQuestionOption = (req, res) => {
  QuestionOption.update(req.params.id, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Question option not found' })
    }

    res.json({ message: 'Question option updated successfully' })
  })
}

// DELETE QUESTION OPTION
exports.deleteQuestionOption = (req, res) => {
  QuestionOption.delete(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Question option not found' })
    }

    res.json({ message: 'Question option deleted successfully' })
  })
}