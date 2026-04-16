const Course = require('../models/coursesModel')

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
}