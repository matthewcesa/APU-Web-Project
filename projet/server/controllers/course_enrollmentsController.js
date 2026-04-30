/* const course_enrollment = require('../models/course_enrollmentsModel');

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
} */

  const CourseEnrollment = require('../models/course_enrollmentsModel')

// GET ALL enrollments
exports.getAllEnrollments = (req, res) => {
  CourseEnrollment.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// GET ONE enrollment
exports.getEnrollmentById = (req, res) => {
  CourseEnrollment.getById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Enrollment not found' })
    }

    res.json(results[0])
  })
}

// GET courses by student
exports.getEnrollmentsByStudent = (req, res) => {
  CourseEnrollment.getByStudentId(req.params.studentId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// GET students by course
exports.getEnrollmentsByCourse = (req, res) => {
  CourseEnrollment.getByCourseId(req.params.courseId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(results)
  })
}

// CREATE enrollment
exports.createEnrollment = (req, res) => {
  CourseEnrollment.create(req.body, (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          message: 'This student is already enrolled in this course'
        })
      }

      return res.status(500).json({ error: err.message })
    }

    res.status(201).json({
      message: 'Enrollment created successfully',
      course_enrollment_id: results.insertId
    })
  })
}

// UPDATE enrollment
exports.updateEnrollment = (req, res) => {
  CourseEnrollment.update(req.params.id, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Enrollment not found' })
    }

    res.json({ message: 'Enrollment updated successfully' })
  })
}

// DELETE enrollment
exports.deleteEnrollment = (req, res) => {
  CourseEnrollment.delete(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Enrollment not found' })
    }

    res.json({ message: 'Enrollment deleted successfully' })
  })
}