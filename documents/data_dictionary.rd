===========================================================
DATA DIRECTORY - LEARNING PLATFORM DATABASE
===========================================================

1. TABLE: Users
Description: Stores user accounts, credentials, and roles.
-----------------------------------------------------------
- user_id (INT, PK): Unique identifier, auto-incremented.
- first_name (VARCHAR 100): User's first name.
- last_name (VARCHAR 100): User's last name.
- email (VARCHAR 255, UNIQUE): Unique email address used as login.
- password_hash (VARCHAR 255): Securely hashed password.
- role (ENUM): User role (admin, teacher, student). Default: student.
- status (ENUM): Account state (active, inactive, suspended).
- created_at (DATETIME): Timestamp when the account was created.
- updated_at (DATETIME): Timestamp of the last update (automatic).

2. TABLE: Courses
Description: List of courses created by teachers.
-----------------------------------------------------------
- course_id (INT, PK): Unique identifier for the course.
- join_code (VARCHAR 10, UNIQUE): Unique code used by students to enroll.
- title (VARCHAR 255): Name of the course.
- slug (VARCHAR 255, UNIQUE): URL-friendly version of the title.
- short_description (TEXT): Brief summary of the course content.
- is_published (BOOLEAN): Visibility status (0=Draft, 1=Published).
- visibility (ENUM): Access type (private, public, unlisted).
- teacher_id (INT, FK): Reference to Users(user_id) of the creator.

3. TABLE: CourseEnrollments
Description: Manages the relationship between students and courses.
-----------------------------------------------------------
- course_enrollment_id (INT, PK): Unique identifier for the enrollment.
- joined_at (DATETIME): Date and time the student joined.
- status (ENUM): Enrollment state (active, completed, dropped).
- student_id (INT, FK): Reference to Users(user_id).
- course_id (INT, FK): Reference to Courses(course_id).

4. TABLE: Modules
Description: Chapters or sections that organize a course.
-----------------------------------------------------------
- module_id (INT, PK): Unique identifier for the module.
- title (VARCHAR 255): Title of the module.
- description (TEXT): Detailed description of the module content.
- position (INT): Sorting order within the course.
- is_published (BOOLEAN): Whether the module is visible to students.
- course_id (INT, FK): Reference to Courses(course_id).

5. TABLE: Quizzes
Description: Assessments or quizzes linked to a module.
-----------------------------------------------------------
- quiz_id (INT, PK): Unique identifier for the quiz.
- title (VARCHAR 255): Name of the quiz.
- type (ENUM): Quiz nature (qcm, practice, exam).
- mode (ENUM): Question delivery (standard, randomized).
- is_published (BOOLEAN): Visibility status for students.
- time_limit_minutes (INT): Time allowed to complete the quiz.
- max_attempts (INT): Maximum number of attempts allowed per student.
- module_id (INT, FK): Reference to Modules(module_id).
- teacher_id (INT, FK): Reference to Users(user_id).

6. TABLE: Questions
Description: Individual questions belonging to a specific quiz.
-----------------------------------------------------------
- question_id (INT, PK): Unique identifier for the question.
- question_text (TEXT): The actual question wording.
- question_type (ENUM): Type (single_choice, multiple_choice).
- points (DECIMAL 10,2): Point value for the question (default 1.00).
- quiz_id (INT, FK): Reference to Quizzes(quiz_id).

7. TABLE: QuestionOptions
Description: Possible answers for each question.
-----------------------------------------------------------
- option_id (INT, PK): Unique identifier for the answer option.
- text (TEXT): The text of the answer option.
- is_correct (BOOLEAN): Flag indicating if this is a correct answer.
- question_id (INT, FK): Reference to Questions(question_id).

8. TABLE: Attempts
Description: Records of a student's session taking a quiz.
-----------------------------------------------------------
- attempt_id (INT, PK): Unique identifier for the attempt.
- score (DECIMAL 10,2): Total score achieved in this session.
- submitted_at (DATETIME): Date and time of submission.
- student_id (INT, FK): Reference to Users(user_id).
- quiz_id (INT, FK): Reference to Quizzes(quiz_id).

9. TABLE: AttemptAnswers
Description: Specific choices made by a student during an attempt.
-----------------------------------------------------------
- attempt_answer_id (INT, PK): Unique identifier for the record.
- is_selected (BOOLEAN): Whether the student selected this option.
- awarded_points (DECIMAL 10,2): Points earned for this specific answer.
- attempt_id (INT, FK): Reference to Attempts(attempt_id).
- option_id (INT, FK): Reference to QuestionOptions(option_id).
- question_id (INT, FK): Reference to Questions(question_id).

===========================================================
DATABASE RELATIONSHIP RULES (ON DELETE)
===========================================================
- Users -> Courses: SET NULL (Courses remain even if the teacher is deleted).
- Courses -> Modules/Enrollments: CASCADE (Deleting a course deletes its modules/enrollments).
- Modules -> Quizzes: SET NULL (Quizzes remain but are detached from the module).
- Quizzes -> Questions/Attempts: CASCADE (Deleting a quiz deletes all its questions/results).
- Questions -> Options/AttemptAnswers: CASCADE (Deleting a question deletes its options/history).
===========================================================