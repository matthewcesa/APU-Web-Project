const bcrypt = require('bcryptjs')
const db = require('./db')

const database = db.promise()

async function resetDatabase() {
  console.log('Resetting database...')

  await database.query('SET FOREIGN_KEY_CHECKS = 0')

  const tables = [
    'AttemptAnswers',
    'Attempts',
    'QuestionOptions',
    'Questions',
    'Quizzes',
    'Modules',
    'CourseEnrollments',
    'Courses',
    'Users',
  ]

  for (const table of tables) {
    await database.query(`DELETE FROM ${table}`)
    await database.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`)
  }

  await database.query('SET FOREIGN_KEY_CHECKS = 1')
}

async function createUsers() {
  console.log('Creating users...')

  const passwordHash = await bcrypt.hash('password123', 10)

  const users = [
    {
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@test.com',
      password_hash: passwordHash,
      role: 'admin',
      status: 'active',
    },
    {
      first_name: 'Teacher',
      last_name: 'User',
      email: 'teacher@test.com',
      password_hash: passwordHash,
      role: 'teacher',
      status: 'active',
    },
    {
      first_name: 'Student',
      last_name: 'One',
      email: 'student1@test.com',
      password_hash: passwordHash,
      role: 'student',
      status: 'active',
    },
    {
      first_name: 'Student',
      last_name: 'Two',
      email: 'student2@test.com',
      password_hash: passwordHash,
      role: 'student',
      status: 'active',
    },
  ]

  const ids = {}

  for (const user of users) {
    const [result] = await database.query('INSERT INTO Users SET ?', [user])
    ids[user.email] = result.insertId
  }

  return {
    adminId: ids['admin@test.com'],
    teacherId: ids['teacher@test.com'],
    studentOneId: ids['student1@test.com'],
    studentTwoId: ids['student2@test.com'],
  }
}

async function createCourses(teacherId) {
  console.log('Creating courses...')

  const courses = [
    {
      join_code: 'WEB101',
      title: 'Web Development Basics',
      slug: 'web-development-basics',
      short_description: 'Learn the foundations of HTML, CSS and JavaScript.',
      is_published: true,
      visibility: 'public',
      teacher_id: teacherId,
    },
    {
      join_code: 'SQL101',
      title: 'Database Fundamentals',
      slug: 'database-fundamentals',
      short_description: 'Understand relational databases and SQL basics.',
      is_published: true,
      visibility: 'public',
      teacher_id: teacherId,
    },
  ]

  const ids = {}

  for (const course of courses) {
    const [result] = await database.query('INSERT INTO Courses SET ?', [course])
    ids[course.slug] = result.insertId
  }

  return {
    webCourseId: ids['web-development-basics'],
    databaseCourseId: ids['database-fundamentals'],
  }
}

async function createEnrollments(studentOneId, studentTwoId, webCourseId, databaseCourseId) {
  console.log('Creating enrollments...')

  const enrollments = [
    {
      student_id: studentOneId,
      course_id: webCourseId,
      status: 'active',
    },
    {
      student_id: studentOneId,
      course_id: databaseCourseId,
      status: 'active',
    },
    {
      student_id: studentTwoId,
      course_id: webCourseId,
      status: 'active',
    },
  ]

  for (const enrollment of enrollments) {
    await database.query('INSERT INTO CourseEnrollments SET ?', [enrollment])
  }
}

async function createModules(webCourseId, databaseCourseId) {
  console.log('Creating modules...')

  const modules = [
    {
      title: 'HTML and CSS Fundamentals',
      description: 'Learn how web pages are structured and styled.',
      position: 1,
      is_published: true,
      course_id: webCourseId,
    },
    {
      title: 'JavaScript Introduction',
      description: 'Discover variables, functions and basic JavaScript logic.',
      position: 2,
      is_published: true,
      course_id: webCourseId,
    },
    {
      title: 'SQL Basics',
      description: 'Learn tables, SELECT queries and basic filtering.',
      position: 1,
      is_published: true,
      course_id: databaseCourseId,
    },
  ]

  const ids = {}

  for (const module of modules) {
    const [result] = await database.query('INSERT INTO Modules SET ?', [module])
    ids[module.title] = result.insertId
  }

  return {
    htmlCssModuleId: ids['HTML and CSS Fundamentals'],
    javascriptModuleId: ids['JavaScript Introduction'],
    sqlModuleId: ids['SQL Basics'],
  }
}

async function createQuizzes(htmlCssModuleId, javascriptModuleId, sqlModuleId, teacherId) {
  console.log('Creating quizzes...')

  const quizzes = [
    {
      title: 'HTML Basics Quiz',
      description: 'Test your knowledge of basic HTML structure.',
      type: 'practice',
      mode: 'standard',
      is_published: true,
      time_limit_minutes: 15,
      max_attempts: 3,
      show_immediate_correction: true,
      allow_review: true,
      backtracking: true,
      module_id: htmlCssModuleId,
      teacher_id: teacherId,
    },
    {
      title: 'JavaScript Basics Quiz',
      description: 'Check your understanding of variables and functions.',
      type: 'exam',
      mode: 'standard',
      is_published: true,
      time_limit_minutes: 20,
      max_attempts: 3,
      show_immediate_correction: true,
      allow_review: true,
      backtracking: true,
      module_id: javascriptModuleId,
      teacher_id: teacherId,
    },
    {
      title: 'SQL Introduction Quiz',
      description: 'Test your understanding of simple SQL queries.',
      type: 'practice',
      mode: 'standard',
      is_published: true,
      time_limit_minutes: 15,
      max_attempts: 3,
      show_immediate_correction: true,
      allow_review: true,
      backtracking: true,
      module_id: sqlModuleId,
      teacher_id: teacherId,
    },
  ]

  const ids = {}

  for (const quiz of quizzes) {
    const [result] = await database.query('INSERT INTO Quizzes SET ?', [quiz])
    ids[quiz.title] = result.insertId
  }

  return {
    htmlQuizId: ids['HTML Basics Quiz'],
    jsQuizId: ids['JavaScript Basics Quiz'],
    sqlQuizId: ids['SQL Introduction Quiz'],
  }
}

async function createQuestionsAndOptions(htmlQuizId, jsQuizId, sqlQuizId) {
  console.log('Creating questions and options...')

  async function createQuestion(question) {
    const [result] = await database.query('INSERT INTO Questions SET ?', [question])
    return result.insertId
  }

  async function createOptions(options) {
    const optionIds = []

    for (const option of options) {
      const [result] = await database.query('INSERT INTO QuestionOptions SET ?', [option])
      optionIds.push(result.insertId)
    }

    return optionIds
  }

  const htmlQ1 = await createQuestion({
    question_text: 'What does HTML stand for?',
    question_type: 'single_choice',
    points: 1,
    quiz_id: htmlQuizId,
  })

  const htmlQ1Options = await createOptions([
    {
      text: 'HyperText Markup Language',
      is_correct: true,
      question_id: htmlQ1,
    },
    {
      text: 'HighText Machine Language',
      is_correct: false,
      question_id: htmlQ1,
    },
    {
      text: 'HyperTool Multi Language',
      is_correct: false,
      question_id: htmlQ1,
    },
  ])

  const htmlQ2 = await createQuestion({
    question_text: 'Which HTML tag is used to create a paragraph?',
    question_type: 'single_choice',
    points: 1,
    quiz_id: htmlQuizId,
  })

  await createOptions([
    {
      text: '<p>',
      is_correct: true,
      question_id: htmlQ2,
    },
    {
      text: '<paragraph>',
      is_correct: false,
      question_id: htmlQ2,
    },
    {
      text: '<text>',
      is_correct: false,
      question_id: htmlQ2,
    },
  ])

  const jsQ1 = await createQuestion({
    question_text: 'Which keyword can be used to declare a variable in JavaScript?',
    question_type: 'multiple_choice',
    points: 2,
    quiz_id: jsQuizId,
  })

  await createOptions([
    {
      text: 'let',
      is_correct: true,
      question_id: jsQ1,
    },
    {
      text: 'const',
      is_correct: true,
      question_id: jsQ1,
    },
    {
      text: 'define',
      is_correct: false,
      question_id: jsQ1,
    },
    {
      text: 'var',
      is_correct: true,
      question_id: jsQ1,
    },
  ])

  const jsQ2 = await createQuestion({
    question_text: 'What is the result of 2 + "2" in JavaScript?',
    question_type: 'single_choice',
    points: 1,
    quiz_id: jsQuizId,
  })

  await createOptions([
    {
      text: '4',
      is_correct: false,
      question_id: jsQ2,
    },
    {
      text: '22',
      is_correct: true,
      question_id: jsQ2,
    },
    {
      text: 'NaN',
      is_correct: false,
      question_id: jsQ2,
    },
  ])

  const sqlQ1 = await createQuestion({
    question_text: 'Which SQL keyword is used to retrieve data from a table?',
    question_type: 'single_choice',
    points: 1,
    quiz_id: sqlQuizId,
  })

  await createOptions([
    {
      text: 'SELECT',
      is_correct: true,
      question_id: sqlQ1,
    },
    {
      text: 'GET',
      is_correct: false,
      question_id: sqlQ1,
    },
    {
      text: 'FETCH',
      is_correct: false,
      question_id: sqlQ1,
    },
  ])

  const sqlQ2 = await createQuestion({
    question_text: 'Which clause is used to filter results in SQL?',
    question_type: 'single_choice',
    points: 1,
    quiz_id: sqlQuizId,
  })

  await createOptions([
    {
      text: 'WHERE',
      is_correct: true,
      question_id: sqlQ2,
    },
    {
      text: 'ORDER BY',
      is_correct: false,
      question_id: sqlQ2,
    },
    {
      text: 'GROUP BY',
      is_correct: false,
      question_id: sqlQ2,
    },
  ])

  return {
    sampleQuestionId: htmlQ1,
    sampleCorrectOptionId: htmlQ1Options[0],
    sampleWrongOptionId: htmlQ1Options[1],
  }
}

async function createSampleAttempt(studentOneId, htmlQuizId, sampleQuestionId, sampleCorrectOptionId) {
  console.log('Creating sample attempt...')

  const [attemptResult] = await database.query('INSERT INTO Attempts SET ?', [
    {
      student_id: studentOneId,
      quiz_id: htmlQuizId,
      score: 1,
    },
  ])

  const attemptId = attemptResult.insertId

  await database.query('INSERT INTO AttemptAnswers SET ?', [
    {
      attempt_id: attemptId,
      question_id: sampleQuestionId,
      option_id: sampleCorrectOptionId,
      is_selected: true,
      awarded_points: 1,
    },
  ])
}

async function seedDatabase() {
  try {
    await resetDatabase()

    const { teacherId, studentOneId, studentTwoId } = await createUsers()

    const { webCourseId, databaseCourseId } = await createCourses(teacherId)

    await createEnrollments(studentOneId, studentTwoId, webCourseId, databaseCourseId)

    const { htmlCssModuleId, javascriptModuleId, sqlModuleId } = await createModules(
      webCourseId,
      databaseCourseId
    )

    const { htmlQuizId, jsQuizId, sqlQuizId } = await createQuizzes(
      htmlCssModuleId,
      javascriptModuleId,
      sqlModuleId,
      teacherId
    )

    const { sampleQuestionId, sampleCorrectOptionId } = await createQuestionsAndOptions(
      htmlQuizId,
      jsQuizId,
      sqlQuizId
    )

    await createSampleAttempt(studentOneId, htmlQuizId, sampleQuestionId, sampleCorrectOptionId)

    console.log('')
    console.log('Database seeded successfully.')
    console.log('')
    console.log('Default accounts:')
    console.log('admin@test.com    / password123')
    console.log('teacher@test.com  / password123')
    console.log('student1@test.com / password123')
    console.log('student2@test.com / password123')
    console.log('')

    db.end()
  } catch (error) {
    console.error('Seeder failed:', error)
    db.end()
  }
}

seedDatabase()