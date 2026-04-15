# Data Dictionary — `learning_platform`

Database : `learning_platform`

## Table : `users`

| # | Column | Type | Constraints | Default | Description |
|---|---|---|---|---|---|
| 1 | `id` | `int(10) unsigned` | PK, NOT NULL, AUTO_INCREMENT | — | Unique identifier for the user |
| 2 | `first_name` | `varchar(100)` | NOT NULL | — | User's first name |
| 3 | `last_name` | `varchar(100)` | NOT NULL | — | User's last name |
| 4 | `email` | `varchar(150)` | UNIQUE, NOT NULL | — | Email address (used as login identifier) |
| 5 | `password_hash` | `varchar(255)` | NOT NULL | — | Hashed password (bcrypt) |
| 6 | `role` | `enum('admin','teacher','student')` | NOT NULL | `student` | User's role in the application |
| 7 | `status` | `enum('active','inactive','blocked')` | NOT NULL | `active` | Account status |
| 8 | `created_at` | `timestamp` | NOT NULL | `current_timestamp()` | Account creation date |
| 9 | `updated_at` | `timestamp` | NOT NULL | `current_timestamp()` | Automatically updated on every modification |

**Indexes:** `idx_users_role` (role), `idx_users_status` (status)

## Table : `courses`

| # | Column | Type | Constraints | Default | Description |
|---|---|---|---|---|---|
| 1 | `id` | `int(10) unsigned` | PK, NOT NULL, AUTO_INCREMENT | — | Unique identifier for the course |
| 2 | `teacher_id` | `int(10) unsigned` | FK → `users.id`, NOT NULL | — | Identifier of the teacher who created the course |
| 3 | `title` | `varchar(200)` | NOT NULL | — | Course title |
| 4 | `slug` | `varchar(220)` | UNIQUE, NOT NULL | — | URL-friendly version of the title (e.g. `my-sql-course`) |
| 5 | `short_description` | `varchar(255)` | NULL | `NULL` | Short description displayed in course listings |
| 6 | `description` | `text` | NULL | `NULL` | Full course description |
| 7 | `thumbnail_url` | `varchar(255)` | NULL | `NULL` | URL of the cover image |
| 8 | `is_published` | `tinyint(1)` | NOT NULL | `0` | 0 = draft, 1 = published |
| 9 | `visibility` | `enum('private','public')` | NOT NULL | `private` | Course visibility |
| 10 | `created_at` | `timestamp` | NOT NULL | `current_timestamp()` | Course creation date |
| 11 | `updated_at` | `timestamp` | NOT NULL | `current_timestamp()` | Automatically updated on every modification |

**Foreign keys:** `fk_courses_teacher` → `users(id)` ON DELETE CASCADE ON UPDATE CASCADE
**Indexes:** `idx_courses_teacher_id`, `idx_courses_is_published`, `idx_courses_visibility`

## Table : `course_join_codes`

| # | Column | Type | Constraints | Default | Description |
|---|---|---|---|---|---|
| 1 | `id` | `int(10) unsigned` | PK, NOT NULL, AUTO_INCREMENT | — | Unique identifier for the join code |
| 2 | `course_id` | `int(10) unsigned` | FK → `courses.id`, NOT NULL | — | Course associated with the join code |
| 3 | `code` | `varchar(30)` | UNIQUE, NOT NULL | — | Unique invitation code |
| 4 | `is_active` | `tinyint(1)` | NOT NULL | `1` | 1 = active, 0 = disabled |
| 5 | `expires_at` | `datetime` | NULL | `NULL` | Code expiration date (null = no expiration) |
| 6 | `created_at` | `timestamp` | NOT NULL | `current_timestamp()` | Code creation date |

**Foreign keys:** `fk_course_join_codes_course` → `courses(id)` ON DELETE CASCADE ON UPDATE CASCADE
**Indexes:** `idx_course_join_codes_course_id`, `idx_course_join_codes_is_active`

## Table : `course_enrollments`

| # | Column | Type | Constraints | Default | Description |
|---|---|---|---|---|---|
| 1 | `id` | `int(10) unsigned` | PK, NOT NULL, AUTO_INCREMENT | — | Unique identifier for the enrollment |
| 2 | `course_id` | `int(10) unsigned` | FK → `courses.id`, NOT NULL | — | Enrolled course |
| 3 | `student_id` | `int(10) unsigned` | FK → `users.id`, NOT NULL | — | Enrolled student |
| 4 | `joined_at` | `timestamp` | NOT NULL | `current_timestamp()` | Enrollment date |
| 5 | `status` | `enum('active','removed','completed')` | NOT NULL | `active` | Enrollment status |

**Foreign keys:** `fk_course_enrollments_course` → `courses(id)` ON DELETE CASCADE, `fk_course_enrollments_student` → `users(id)` ON DELETE CASCADE

## Table : `sections`

| # | Column | Type | Constraints | Default | Description |
|---|---|---|---|---|---|
| 1 | `id` | `int(10) unsigned` | PK, NOT NULL, AUTO_INCREMENT | — | Unique identifier for the section |
| 2 | `course_id` | `int(10) unsigned` | FK → `courses.id`, NOT NULL | — | Course the section belongs to |
| 3 | `title` | `varchar(200)` | NOT NULL | — | Section title |
| 4 | `description` | `text` | NULL | `NULL` | Section description |
| 5 | `position` | `int(10) unsigned` | NOT NULL | `1` | Display order within the course |
| 6 | `is_published` | `tinyint(1)` | NOT NULL | `1` | 1 = published, 0 = hidden |
| 7 | `created_at` | `timestamp` | NOT NULL | `current_timestamp()` | Creation date |
| 8 | `updated_at` | `timestamp` | NOT NULL | `current_timestamp()` | Automatically updated on every modification |

**Foreign keys:** `fk_sections_course` → `courses(id)` ON DELETE CASCADE ON UPDATE CASCADE

## Table relationships
users
 ├── courses (teacher_id → users.id)
 │    ├── course_join_codes (course_id → courses.id)
 │    ├── course_enrollments (course_id → courses.id)
 │    └── sections (course_id → courses.id)
 └── course_enrollments (student_id → users.id)
