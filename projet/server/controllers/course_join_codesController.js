 const cjc = require('../models/course_join_codesModel');

exports.getAllCourse_join_codes = (req,res) => {
    cjc.getAll((err, results) => { 
        if (err) throw err;
        res.json(results);
    })
}

exports.getCourse_join_coderById = (req, res) => {
  cjc.getById(req.params.id, (err, results) => {
    if (err) throw err;
    res.json(results[0])
  })
}


exports.createCourse_join_code = (req, res) => {
  cjc.create(req.body, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}


exports.updateCourse_join_code = (req, res) => {
  cjc.update(req.params.id, req.body, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}


exports.deleteCourse_join_code = (req, res) => {
  cjc.delete(req.params.id, (err, results) => {
    if (err) throw err;
    res.json(results);
  })
}