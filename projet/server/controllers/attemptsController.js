/*const attempt = require('../models/attemptsModel')

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
}*/

const Attempt = require('../models/attemptsModel')

// GET ALL ATTEMPTS
exports.getAllAttempts = (req, res) => {
  Attempt.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// GET ONE ATTEMPT
exports.getAttemptById = (req, res) => {
  Attempt.getById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Attempt not found' })
    }

    res.json(results[0])
  })
}

// GET ATTEMPTS BY STUDENT
exports.getAttemptsByStudentId = (req, res) => {
  Attempt.getByStudentId(req.params.studentId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// GET ATTEMPTS BY QUIZ
exports.getAttemptsByQuizId = (req, res) => {
  Attempt.getByQuizId(req.params.quizId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// GET ATTEMPTS BY STUDENT AND QUIZ
exports.getAttemptsByStudentAndQuiz = (req, res) => {
  Attempt.getByStudentAndQuiz(
    req.params.studentId,
    req.params.quizId,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      res.json(results)
    }
  )
}

// CREATE ATTEMPT
exports.createAttempt = (req, res) => {
  Attempt.create(req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.status(201).json({
      message: 'Attempt created successfully',
      attempt_id: results.insertId,
    })
  })
}

// UPDATE ATTEMPT
exports.updateAttempt = (req, res) => {
  Attempt.update(req.params.id, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Attempt not found' })
    }

    res.json({ message: 'Attempt updated successfully' })
  })
}

// DELETE ATTEMPT
exports.deleteAttempt = (req, res) => {
  Attempt.delete(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Attempt not found' })
    }

    res.json({ message: 'Attempt deleted successfully' })
  })
}