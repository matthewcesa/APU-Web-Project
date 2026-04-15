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
const courses_join_codes_Route = require('./routes/course_join_codes');
const modulesRoute = require('./routes/modules')
const courses_enrollmentsRoute = require('./routes/course_enrollments');
app.use('/api/courses', coursesRoute);
app.use('/api/users', usersRoute);
app.use('/api/modules', modulesRoute);
app.use('/api/courses_join_codes', courses_join_codes_Route);
app.use('/api/courses_enrollments', courses_enrollmentsRoute);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
