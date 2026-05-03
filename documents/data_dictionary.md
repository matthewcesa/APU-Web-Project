# Data Directory — Learning Platform Database

***

## Table 1 — Users

> Stores user accounts, credentials, and roles.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `user_id` | INT | PK, AUTO_INCREMENT | Unique identifier |
| `first_name` | VARCHAR(100) | NOT NULL | User's first name |
| `last_name` | VARCHAR(100) | NOT NULL | User's last name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email address |
| `password_hash` | VARCHAR(255) | NOT NULL | Securely hashed password |
| `role` | ENUM | Default: `student` | `admin`, `teacher`, `student` |
| `status` | ENUM | NOT NULL | `active`, `inactive`, `suspended` |
| `created_at` | DATETIME | AUTO | Account creation timestamp |
| `updated_at` | DATETIME | AUTO UPDATE | Last update timestamp |

***

## Table 2 — Courses

> List of courses created by teachers.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `course_id` | INT | PK, AUTO_INCREMENT | Unique identifier |
| `join_code` | VARCHAR(10) | UNIQUE | Code used by students to enroll |
| `title` | VARCHAR(255) | NOT NULL | Course name |
| `slug` | VARCHAR(255) | UNIQUE | URL-friendly version of the title |
| `short_description` | TEXT | — | Brief summary of the course |
| `is_published` | BOOLEAN | Default: `0` | `0` = Draft, `1` = Published |
| `visibility` | ENUM | — | `private`, `public`, `unlisted` |
| `teacher_id` | INT | FK → Users | Creator's user ID |

***

## Table 3 — CourseEnrollments

> Manages the relationship between students and courses.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `course_enrollment_id` | INT | PK, AUTO_INCREMENT | Unique identifier |
| `joined_at` | DATETIME | AUTO | Enrollment timestamp |
| `status` | ENUM | NOT NULL | `active`, `completed`, `dropped` |
| `student_id` | INT | FK → Users | Enrolled student's ID |
| `course_id` | INT | FK → Courses | Enrolled course's ID |

***

## Table 4 — Modules

> Chapters or sections that organize a course.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `module_id` | INT | PK, AUTO_INCREMENT | Unique identifier |
| `title` | VARCHAR(255) | NOT NULL | Module title |
| `description` | TEXT | — | Detailed description |
| `position` | INT | — | Sorting order within the course |
| `is_published` | BOOLEAN | Default: `0` | Visibility for students |
| `course_id` | INT | FK → Courses | Parent course ID |

***

## Table 5 — Quizzes

> Assessments or quizzes linked to a module.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `quiz_id` | INT | PK, AUTO_INCREMENT | Unique identifier |
| `title` | VARCHAR(255) | NOT NULL | Quiz name |
| `type` | ENUM | NOT NULL | `qcm`, `practice`, `exam` |
| `mode` | ENUM | Default: `standard` | `standard`, `randomized` |
| `is_published` | BOOLEAN | Default: `0` | Visibility for students |
| `time_limit_minutes` | INT | — | Time allowed (in minutes) |
| `max_attempts` | INT | — | Max attempts per student |
| `module_id` | INT | FK → Modules | Parent module ID |
| `teacher_id` | INT | FK → Users | Creator's user ID |

***

## Table 6 — Questions

> Individual questions belonging to a specific quiz.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `question_id` | INT | PK, AUTO_INCREMENT | Unique identifier |
| `question_text` | TEXT | NOT NULL | The question wording |
| `question_type` | ENUM | NOT NULL | `single_choice`, `multiple_choice` |
| `points` | DECIMAL(10,2) | Default: `1.00` | Point value |
| `quiz_id` | INT | FK → Quizzes | Parent quiz ID |

***

## Table 7 — QuestionOptions

> Possible answers for each question.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `option_id` | INT | PK, AUTO_INCREMENT | Unique identifier |
| `text` | TEXT | NOT NULL | Answer option text |
| `is_correct` | BOOLEAN | Default: `0` | `1` if this is a correct answer |
| `question_id` | INT | FK → Questions | Parent question ID |

***

## Table 8 — Attempts

> Records of a student's session taking a quiz.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `attempt_id` | INT | PK, AUTO_INCREMENT | Unique identifier |
| `score` | DECIMAL(10,2) | — | Total score for this session |
| `submitted_at` | DATETIME | AUTO | Submission timestamp |
| `student_id` | INT | FK → Users | Student's user ID |
| `quiz_id` | INT | FK → Quizzes | Attempted quiz ID |

***

## Table 9 — AttemptAnswers

> Specific choices made by a student during an attempt.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `attempt_answer_id` | INT | PK, AUTO_INCREMENT | Unique identifier |
| `is_selected` | BOOLEAN | NOT NULL | Whether the student selected this option |
| `awarded_points` | DECIMAL(10,2) | Default: `0.00` | Points earned for this answer |
| `attempt_id` | INT | FK → Attempts | Parent attempt ID |
| `option_id` | INT | FK → QuestionOptions | Selected option ID |
| `question_id` | INT | FK → Questions | Related question ID |

***

## Relationship Rules (ON DELETE)

| Relationship | Rule | Effect |
|---|---|---|
| Users → Courses | `SET NULL` | Courses remain if the teacher is deleted |
| Courses → Modules / Enrollments | `CASCADE` | Deleting a course removes all its modules and enrollments |
| Modules → Quizzes | `SET NULL` | Quizzes remain but are detached from the module |
| Quizzes → Questions / Attempts | `CASCADE` | Deleting a quiz removes all its questions and results |
| Questions → Options / AttemptAnswers | `CASCADE` | Deleting a question removes its options and answer history |