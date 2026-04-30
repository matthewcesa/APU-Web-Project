/* const Course = require('../models/coursesModel')

// GET ALL COURSES
exports.getAllCourses = (req, res) => {
  Course.getAll((err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// GET ONE COURSE
exports.getCourseById = (req, res) => {
  Course.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results[0])
  })
}

// CREATE COURSE
exports.createCourse = (req, res) => {
  Course.create(req.body, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// UPDATE COURSE
exports.updateCourse = (req, res) => {
  Course.update(req.params.id, req.body, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
}

// DELETE COURSE
exports.deleteCourse = (req, res) => {
  Course.delete(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
} */

  const Course = require('../models/coursesModel')

// GET ALL COURSES
exports.getAllCourses = (req, res) => {
  Course.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// GET ONE COURSE
exports.getCourseById = (req, res) => {
  Course.getById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Course not found' })
    }

    res.json(results[0])
  })
}

// CREATE COURSE
exports.createCourse = (req, res) => {
  Course.create(req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.status(201).json({
      message: 'Course created successfully',
      course_id: results.insertId
    })
  })
}

// UPDATE COURSE
exports.updateCourse = (req, res) => {
  Course.update(req.params.id, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found' })
    }

    res.json({ message: 'Course updated successfully' })
  })
}

// DELETE COURSE
exports.deleteCourse = (req, res) => {
  Course.delete(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found' })
    }

    res.json({ message: 'Course deleted successfully' })
  })
}