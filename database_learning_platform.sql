SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `learning_platform`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE `learning_platform`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `AttemptAnswers`;
DROP TABLE IF EXISTS `Attempts`;
DROP TABLE IF EXISTS `CourseEnrollments`;
DROP TABLE IF EXISTS `QuestionOptions`;
DROP TABLE IF EXISTS `Questions`;
DROP TABLE IF EXISTS `Quizzes`;
DROP TABLE IF EXISTS `Modules`;
DROP TABLE IF EXISTS `Courses`;
DROP TABLE IF EXISTS `Users`;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- Users
-- Roles: admin, teacher,student
-- =========================================================
CREATE TABLE `Users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'teacher', 'student') NOT NULL DEFAULT 'student',
  `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- Courses
-- A course belongs to one teacher.
-- Students join through CourseEnrollments.
-- =========================================================
CREATE TABLE `Courses` (
  `course_id` INT NOT NULL AUTO_INCREMENT,
  `join_code` VARCHAR(10) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `short_description` TEXT DEFAULT NULL,
  `is_published` BOOLEAN NOT NULL DEFAULT FALSE,
  `visibility` ENUM('private', 'public', 'unlisted') NOT NULL DEFAULT 'private',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `teacher_id` INT DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `uk_courses_join_code` (`join_code`),
  UNIQUE KEY `uk_courses_slug` (`slug`),
  KEY `idx_courses_teacher` (`teacher_id`),
  CONSTRAINT `fk_course_teacher`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `Users` (`user_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- CourseEnrollments
-- Links students to courses.
-- =========================================================
CREATE TABLE `CourseEnrollments` (
  `course_enrollment_id` INT NOT NULL AUTO_INCREMENT,
  `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('active', 'completed', 'dropped') NOT NULL DEFAULT 'active',
  `student_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  PRIMARY KEY (`course_enrollment_id`),
  UNIQUE KEY `uk_enrollment_student_course` (`student_id`, `course_id`),
  KEY `idx_enroll_student` (`student_id`),
  KEY `idx_enroll_course` (`course_id`),
  CONSTRAINT `fk_enroll_student`
    FOREIGN KEY (`student_id`)
    REFERENCES `Users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_enroll_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `Courses` (`course_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- Modules
-- Modules are chapters/sections inside a course.
-- =========================================================
CREATE TABLE `Modules` (
  `module_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `position` INT NOT NULL DEFAULT 0,
  `is_published` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `course_id` INT NOT NULL,
  PRIMARY KEY (`module_id`),
  KEY `idx_module_course` (`course_id`),
  CONSTRAINT `fk_module_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `Courses` (`course_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- Quizzes
-- A quiz belongs to a module and can also keep the teacher owner.
-- =========================================================
CREATE TABLE `Quizzes` (
  `quiz_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `type` ENUM('qcm', 'practice', 'exam') NOT NULL DEFAULT 'qcm',
  `mode` ENUM('standard', 'randomized') NOT NULL DEFAULT 'standard',
  `is_published` BOOLEAN NOT NULL DEFAULT FALSE,
  `time_limit_minutes` INT DEFAULT NULL,
  `max_attempts` INT DEFAULT NULL,
  `show_immediate_correction` BOOLEAN NOT NULL DEFAULT FALSE,
  `allow_review` BOOLEAN NOT NULL DEFAULT TRUE,
  `backtracking` BOOLEAN NOT NULL DEFAULT TRUE,
  `available_from` DATETIME DEFAULT NULL,
  `available_until` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `module_id` INT DEFAULT NULL,
  `teacher_id` INT DEFAULT NULL,
  PRIMARY KEY (`quiz_id`),
  KEY `idx_quiz_module` (`module_id`),
  KEY `idx_quiz_teacher` (`teacher_id`),
  CONSTRAINT `fk_quiz_module`
    FOREIGN KEY (`module_id`)
    REFERENCES `Modules` (`module_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_quiz_teacher`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `Users` (`user_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- Questions
-- Questions belong to a quiz.
-- =========================================================
CREATE TABLE `Questions` (
  `question_id` INT NOT NULL AUTO_INCREMENT,
  `question_text` TEXT NOT NULL,
  `question_type` ENUM('single_choice', 'multiple_choice') NOT NULL DEFAULT 'single_choice',
  `points` DECIMAL(10,2) NOT NULL DEFAULT 1.00,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `quiz_id` INT NOT NULL,
  PRIMARY KEY (`question_id`),
  KEY `idx_question_quiz` (`quiz_id`),
  CONSTRAINT `fk_question_quiz`
    FOREIGN KEY (`quiz_id`)
    REFERENCES `Quizzes` (`quiz_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- QuestionOptions
-- Possible answers for a question.
-- =========================================================
CREATE TABLE `QuestionOptions` (
  `option_id` INT NOT NULL AUTO_INCREMENT,
  `text` TEXT NOT NULL,
  `is_correct` BOOLEAN NOT NULL DEFAULT FALSE,
  `question_id` INT NOT NULL,
  PRIMARY KEY (`option_id`),
  KEY `idx_option_question` (`question_id`),
  CONSTRAINT `fk_option_question`
    FOREIGN KEY (`question_id`)
    REFERENCES `Questions` (`question_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- Attempts
-- One attempt is one student's submission for one quiz.
-- =========================================================
CREATE TABLE `Attempts` (
  `attempt_id` INT NOT NULL AUTO_INCREMENT,
  `score` DECIMAL(10,2) DEFAULT NULL,
  `submitted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `student_id` INT NOT NULL,
  `quiz_id` INT NOT NULL,
  PRIMARY KEY (`attempt_id`),
  KEY `idx_attempt_student` (`student_id`),
  KEY `idx_attempt_quiz` (`quiz_id`),
  CONSTRAINT `fk_attempt_student`
    FOREIGN KEY (`student_id`)
    REFERENCES `Users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_attempt_quiz`
    FOREIGN KEY (`quiz_id`)
    REFERENCES `Quizzes` (`quiz_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- AttemptAnswers
-- Stores the selected options and awarded points for an attempt.
-- =========================================================
CREATE TABLE `AttemptAnswers` (
  `attempt_answer_id` INT NOT NULL AUTO_INCREMENT,
  `is_selected` BOOLEAN NOT NULL DEFAULT FALSE,
  `awarded_points` DECIMAL(10,2) DEFAULT NULL,
  `attempt_id` INT NOT NULL,
  `option_id` INT DEFAULT NULL,
  `question_id` INT NOT NULL,
  PRIMARY KEY (`attempt_answer_id`),
  KEY `idx_ans_attempt` (`attempt_id`),
  KEY `idx_ans_option` (`option_id`),
  KEY `idx_ans_question` (`question_id`),
  CONSTRAINT `fk_ans_attempt`
    FOREIGN KEY (`attempt_id`)
    REFERENCES `Attempts` (`attempt_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ans_option`
    FOREIGN KEY (`option_id`)
    REFERENCES `QuestionOptions` (`option_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ans_question`
    FOREIGN KEY (`question_id`)
    REFERENCES `Questions` (`question_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
