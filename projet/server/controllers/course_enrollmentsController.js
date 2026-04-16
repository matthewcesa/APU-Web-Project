const course_enrollment = require('../models/course_enrollmentsModel');

// GET ALL course_enrollment
exports.getAllcourse_enrollment = (req, res) => {
  course_enrollment.getAll((err, results) => {
    if (err) throw err;
    res.json(results);
  })
}

// GET ONE course_enrollment
exports.getcourse_enrollmenteById = (req, res) => {
  course_enrollment.getById(req.params.id, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}

// CREATE course_enrollment
exports.createcourse_enrollment = (req, res) => {
  course_enrollment.create(req.body, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}

// UPDATE course_enrollment
exports.updatecourse_enrollment = (req, res) => {
  course_enrollment.update(req.params.id, req.body, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}

// DELETE course_enrollment
exports.deletecourse_enrollment = (req, res) => {
  course_enrollment.delete(req.params.id, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}