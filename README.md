# Advanced Web Programming Project
# MCQoodle - Fullstack WEB Platform (Vue + Express + MySQL)

## Group Collaboration
This project is the result of a collaborative effort by a **team of 4 students** from the same cohort. Working together, we implemented a complete development lifecycle, from initial planning and database schema design to final interfaces and testing.

## Development Team
A special thanks to the team members who contributed to this project:
**Crauser Antoine**,
**Besnard Clément**,
**Gaudissard Karl**, and **Cesa Matthew-Frédérick** 

-------

## Project Overview
This project was developed to fulfill the requirements and prerequisites of the **Advanced Web Programming** module at **Asia Pacific University of Technology and Innovation (APU)**.

The application demonstrates advanced web development concepts, including full-stack integration, database management, and responsive user interface design.

MCQoodle is an application inspired by Moodle for **teachers** to create online **MCQs/quizzes** and for **students** to practice or take exams online.

To run the project, refer to the line "Setup & Running (Development)"

-------


### Main roles
- **Teacher**: creates **courses**, **modules**, **quizzes**, then adds **questions** and their **options**.
- **Student**: joins courses using a **join code**, opens quizzes, and submits answers.
- **Admin**: manages users (create/list).

---

## Architecture
- **Frontend**: Vue 3 + Vue Router (Vite)
- **Backend**: Express (REST API)
- **Database**: MySQL using MAMP(MacOs) & XAMPP (Windows 11)
  Schema/data documentation: `database_learning_platform.sql` + `documents/data_dictionary.rd`

---

## Prerequisites
- **Node.js**: `^20.19.0` or `>=22.12.0` (Node.js 21.x is NOT supported due to Vite compatibility issues)
- MySQL installed and running locally
- MySQL database named: `learning_platform` (or update it in `.env`)

---

## Setup & Running (Development)

### Prerequisites Setup
Before starting, ensure:
1. **MySQL is running** (XAMPP on Windows, MAMP on MacOS)
2. Create a database named `learning_platform` in your MySQL server

### Step 1: Configure Environment Variables
From the `projet` directory, create a `.env` file based on the template:
```bash
cd projet
cp .env.example .env
```

Then edit `.env` to match your setup.

### Step 2: Install root dependencies
From the repository root:
```bash
npm install
```

### Step 3: Install client dependencies
**Important:** The client requires Node.js `^20.19.0` or `>=22.12.0` (Node.js 21.x has compatibility issues with Vite).

Install dependencies for the Vue frontend:
```bash
cd client
npm install
cd ..
```

### Step 4: Import the database schema
1. Open your MySQL client (phpMyAdmin, MySQL Workbench, etc.)
2. Open the file `database_learning_platform.sql` from the project root
3. Execute all the SQL commands to populate your `learning_platform` database

### Step 5: Seed the database with sample data
From the `projet/server` directory, run the seeding script to populate the database with initial data:
```bash
cd server
node seedDatabase.js
```

This will insert sample users (admin, teacher, student), courses, modules, quizzes, and questions into your database.

### Step 6: Start the application
From the `projet` directory:
```bash
npm run dev
```

**What this does:**
- Backend runs on: **http://localhost:3000**
- Frontend runs on: **http://localhost:5173** (Vite default)

---

## Authentication (Login + Role-based routing)
Login is implemented with **localStorage** on the frontend:
- `POST http://localhost:3000/api/users/login`
- The backend returns a `user` object.
- The frontend stores it in `localStorage` under the key **"user"**
- Vue Router protects pages using `meta.requiresAuth` and `meta.role`

> Important: The backend routes are currently **not protected with JWT/middleware**. “Role” checks are enforced on the frontend.

---

## UI Pages / User Flows

### Landing
- `/` (LandingPage): welcome page with a **Login** button.

### Login
- `/login` (LoginPage): email + password form.
- After login, redirects by role:
  - `student` → `/student`
  - `teacher` → `/teacher`
  - `admin` → `/admin`

### Admin dashboard
- `/admin` (HomePage_Admin)
  - List all users: `GET /api/users`
  - Create a user: `POST /api/users`

### Student space
- `/student` (HomePage_Student)
  - Load the student’s course enrollments:  
    `GET /api/course-enrollments/student/:studentId`
  - For each enrollment, load course details:  
    `GET /api/courses/:courseId`
  - Join a course with a join code:  
    `POST /api/course-enrollments/join`

### Teacher space
- `/teacher` (HomePage_Teacher)
  - Load teacher courses: `GET /api/courses/teacher/:teacherId`
  - Create a course: `POST /api/courses`
  - Delete a course: `DELETE /api/courses/:id`

### Course details
- `/courses/:id` (CoursePage)
  - Loads course: `GET /api/courses/:courseId`
  - Loads modules for that course: `GET /api/modules/course/:courseId`
  - Loads quizzes per module: `GET /api/quizzes/module/:moduleId`
  - For students, it also loads last attempts per quiz:  
    `GET /api/attempts/student/:studentId/quiz/:quizId`

Teacher-only features on this page:
- Update course fields (`PUT /api/courses/:id`)
- Create modules (`POST /api/modules`)
- Create quizzes (`POST /api/quizzes`)
- Delete quizzes (`DELETE /api/quizzes/:id`)

### Quiz details
- `/quizzes/:id` (QuizPage)
  - Loads quiz: `GET /api/quizzes/:quizId`
  - Loads questions: `GET /api/questions/quiz/:quizId`
  - Loads options for each question:  
    `GET /api/question-options/question/:questionId`

Student behavior:
- Timer starts if the quiz has a time limit.
- For exams, submission is handled automatically when time runs out.
- Submitting an attempt creates:
  - `POST /api/attempts`
  - then multiple `POST /api/attempt-answers` (one per selected option)

Teacher behavior:
- Edit quiz configuration (title/description/time/max_attempts/type) via `PUT /api/quizzes/:id`
- Add/edit questions and options:
  - create question: `POST /api/questions`
  - create options: `POST /api/question-options`
  - update question: `PUT /api/questions/:questionId`

---

## Environment Variables

All sensitive configuration should be stored in a `.env` file in the `projet` directory. **Never commit this file to version control.**

### Creating Your `.env` File

1. Copy the template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your local credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=        # Your MySQL password (empty if none)
   DB_NAME=learning_platform
   PORT=3000
   NODE_ENV=development
   ```

### Available Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL server host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | empty string |
| `DB_NAME` | Database name | `learning_platform` |
| `PORT` | Backend server port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |

### Important Notes
- The `.env` file is **gitignored** and should never be committed
- Keep `.env.example` updated with new variables (without sensitive values)
- Each developer should have their own `.env` file

---

## References (within the repo)
- DB schema: `database_learning_platform.sql`
- DB dictionary: `documents/data_dictionary.rd`
- Backend routes: `projet/server/routes/*`
- Frontend pages:
  - `projet/client/src/views/LandingPage.vue`
  - `projet/client/src/views/LoginPage.vue`
  - `projet/client/src/views/HomePage_Admin.vue`
  - `projet/client/src/views/HomePage_Student.vue`
  - `projet/client/src/views/HomePage_Teacher.vue`
  - `projet/client/src/views/CoursePage.vue`
  - `projet/client/src/views/QuizPage.vue`
