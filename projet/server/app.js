const express = require('express');
const app = express();
const port = 3000;

var cors = require('cors')
var bodyParser = require('body-parser')

const db = require('./db');

app.use(cors())
app.use(bodyParser.json()) // for parsing application/json

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const coursesRoute = require('./routes/courses');
const usersRoute = require('./routes/users');
const modulesRoute = require('./routes/modules.js')
const courses_enrollmentsRoute = require('./routes/course_enrollments')
const quizzRoute= require('./routes/quizzes');
const questionsRoute = require('./routes/questions.js');
const questionOptionsRoute = require('./routes/questionOptions.js');
const attemptsRoute = require('./routes/attempts')
const attemptAnswersRoute = require('./routes/attemptAnswers.js');
app.use('/api/courses', coursesRoute);
app.use('/api/users', usersRoute);
app.use('/api/modules', modulesRoute);
app.use('/api/courses_enrollments', courses_enrollmentsRoute);
app.use('/api/quizzes', quizzRoute );
app.use('/api/questions', questionsRoute);
app.use('/api/question-options', questionOptionsRoute);
app.use('/api/attempts', attemptsRoute)
app.use('/api/attempt-answers', attemptAnswersRoute);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
