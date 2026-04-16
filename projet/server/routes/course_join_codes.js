const express = require('express');
const routes = express.Router();

const course_jc = require('../controllers/course_join_codesController');

// to get all the course join codes
routes.get('/', course_jc.getAllCourse_join_codes);

// to get one particular course join codes
routes.get('/:id', course_jc.getCourse_join_coderById);

// to create a new course_join_codes
routes.post('/', course_jc.createCourse_join_code);

// to modify the informations of a certain course_join_codes 
routes.put('/:id', course_jc.updateCourse_join_code);

// to delete a certain course_join_codes
routes.delete('/:id', course_jc.deleteCourse_join_code);

module.exports = routes;