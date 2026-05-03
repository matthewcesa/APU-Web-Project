<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../components/PageHeader.vue'
import Footer from '../components/PageFooter.vue'

const router = useRouter()
const route = useRoute()

const storedUser = localStorage.getItem('user')
const user = ref(storedUser ? JSON.parse(storedUser) : null)

const course = ref(null)
const modules = ref([])
const quizzes = ref([])

const courseForm = ref({ title: '', short_description: '' })
const moduleForm = ref({ title: '', description: '' })
const quizForm = ref({
  module_id: '',
  title: '',
  description: '',
  type: 'practice',
  duration: 30,
})

const quizError = ref('')
const quizMessage = ref('')
const courseMessage = ref('')
const moduleMessage = ref('')
const loading = ref(true)
const error = ref('')

const isTeacher = computed(() => String(user.value?.role || '').toLowerCase() === 'teacher')

onMounted(async () => {
  if (!user.value || (user.value.role !== 'student' && user.value.role !== 'teacher')) {
    router.push('/login')
    return
  }
  await fetchCourseData()
})

async function fetchCourseData() {
  loading.value = true
  error.value = ''
  try {
    const courseId = route.params.id

    const courseResp = await fetch(`http://localhost:3000/api/courses/${courseId}`)
    const courseData = await courseResp.json()
    if (!courseResp.ok) throw new Error('Failed to load course')
    course.value = courseData
    courseForm.value = { title: courseData.title, short_description: courseData.short_description }

    const modResp = await fetch(`http://localhost:3000/api/modules/course/${courseId}`)
    const modulesData = await modResp.json()
    modules.value = Array.isArray(modulesData) ? modulesData : []

    const allQuizzes = []
    for (const mod of modules.value) {
      try {
        const qResp = await fetch(`http://localhost:3000/api/quizzes/module/${mod.module_id}`)
        if (qResp.ok) {
          const qData = await qResp.json()

          const enrichedQuizzes = await Promise.all(
            qData.map(async (quiz) => {
              const attResp = await fetch(
                `http://localhost:3000/api/attempts/student/${user.value.user_id}/quiz/${quiz.quiz_id}`,
              )
              const attData = attResp.ok ? await attResp.json() : []

              const quesRes = await fetch(
                `http://localhost:3000/api/questions/quiz/${quiz.quiz_id}`,
              )
              const quesData = await quesRes.json()

              const totalMaxPoints = quesData.reduce((sum, q) => sum + (Number(q.points) || 0), 0)

              return {
                ...quiz,
                module_title: mod.title,
                last_attempt: attData.length > 0 ? attData[0] : null,
                max_points_possible: totalMaxPoints,
              }
            }),
          )
          allQuizzes.push(...enrichedQuizzes)
        }
      } catch (e) {
        console.error('Skip module quizzes fetch error', e)
      }
    }
    quizzes.value = allQuizzes
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function createModule() {
  if (!moduleForm.value.title.trim()) return
  try {
    const response = await fetch('http://localhost:3000/api/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        course_id: course.value.course_id,
        title: moduleForm.value.title,
        description: moduleForm.value.description,
      }),
    })
    if (response.ok) {
      moduleMessage.value = 'Module created!'
      moduleForm.value = { title: '', description: '' }
      await fetchCourseData()
    }
  } catch {
    error.value = 'Failed to create module'
  }
}

async function createQuiz() {
  if (!quizForm.value.module_id || !quizForm.value.title.trim()) {
    quizError.value = 'Please select a module and title.'
    return
  }

  try {
    const response = await fetch('http://localhost:3000/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module_id: quizForm.value.module_id,
        title: quizForm.value.title,
        description: quizForm.value.description,
        type: quizForm.value.type,
        teacher_id: user.value.user_id,
        is_published: 1,
      }),
    })

    if (!response.ok) throw new Error('Creation failed')

    const newQuizFromServer = await response.json()
    const selectedModule = modules.value.find((m) => m.module_id === quizForm.value.module_id)

    const quickQuiz = {
      ...newQuizFromServer,
      quiz_id: newQuizFromServer.quiz_id || newQuizFromServer.id,
      module_title: selectedModule ? selectedModule.title : 'N/A',
      last_attempt: null,
    }

    quizzes.value.push(quickQuiz)

    quizMessage.value = 'Quiz created successfully.'
    quizError.value = ''
    quizForm.value = {
      module_id: '',
      title: '',
      description: '',
      type: 'practice',
      duration: 30,
    }

    await fetchCourseData()
  } catch (err) {
    quizError.value = err.message
  }
}
async function updateCourse() {
  try {
    const response = await fetch(`http://localhost:3000/api/courses/${course.value.course_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseForm.value),
    })
    if (response.ok) {
      courseMessage.value = 'Course updated successfully.'
      await fetchCourseData()
    }
  } catch (err) {
    error.value = err.message
  }
}

function goBack() {
  router.push(user.value?.role === 'teacher' ? '/teacher' : '/student')
}
function openQuiz(quiz) {
  router.push(`/quizzes/${quiz.quiz_id || quiz.id}`)
}

async function deleteQuiz(quizId) {
  if (!confirm('Are you sure you want to delete this quiz definitively ?')) {
    return
  }

  try {
    const response = await fetch(`http://localhost:3000/api/quizzes/${quizId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      quizzes.value = quizzes.value.filter((q) => (q.quiz_id || q.id) !== quizId)
      quizMessage.value = 'Quiz deleted successfully.'
      setTimeout(() => {
        quizMessage.value = ''
      }, 3000)
    } else {
      throw new Error('Failed to delete quiz')
    }
  } catch (err) {
    quizError.value = 'Error: ' + err.message
  }
}
</script>

<template>
  <Header :user="user" />
  <div class="course-page">
    
    <main class="content">
      <button class="back-button" @click="goBack">← Back to courses</button>

      <p v-if="loading" class="message">Loading course...</p>
      <p v-else-if="error" class="error-message">{{ error }}</p>

      <template v-else>
        <section class="course-info">
          <h1>{{ course?.title }}</h1>
          <p>{{ course?.short_description || 'No description available.' }}</p>
          <div class="course-details">
            <span>Code: {{ course?.join_code || 'N/A' }}</span>
            <span>Modules: {{ modules.length }}</span>
            <span>MCQs: {{ quizzes.length }}</span>
          </div>

          <div v-if="isTeacher" class="teacher-course-panel">
            <h2>Teacher controls</h2>

            <div class="admin-card">
              <h3>Edit Course Info</h3>
              <div v-if="courseMessage" class="success-message">{{ courseMessage }}</div>
              <div class="form-group">
                <label>Title</label>
                <input v-model="courseForm.title" type="text" />
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea v-model="courseForm.short_description" rows="2"></textarea>
              </div>
              <button class="primary-button" @click="updateCourse">Save Course</button>
            </div>

            <div class="admin-card module-creation">
              <h3>1. Create a Module (The Link)</h3>
              <p class="help-text">A module connects the course to your quizzes.</p>
              <div v-if="moduleMessage" class="success-message">{{ moduleMessage }}</div>
              <div class="form-group">
                <label>Module Title</label>
                <input
                  v-model="moduleForm.title"
                  type="text"
                  placeholder="ex: Introduction to Algebra"
                />
              </div>
              <button class="primary-button" @click="createModule">Add Module</button>
            </div>
            <div class="admin-card quiz-creation">
              <h3>2. Create a New Quiz</h3>

              <div v-if="quizError" class="error-message">{{ quizError }}</div>
              <div v-if="quizMessage" class="success-message">{{ quizMessage }}</div>

              <div v-if="modules.length === 0" class="empty-box">
                Create a module above before adding quizzes.
              </div>

              <div v-else>
                <div class="form-row">
                  <div class="form-group">
                    <label>Select Module</label>
                    <select v-model="quizForm.module_id">
                      <option value="" disabled>Select a module</option>
                      <option v-for="m in modules" :key="m.module_id" :value="m.module_id">
                        {{ m.title }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Quiz Title</label>
                    <input v-model="quizForm.title" type="text" placeholder="Quiz name..." />
                  </div>
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <input
                    v-model="quizForm.description"
                    type="text"
                    placeholder="Optional description..."
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Type</label>
                    <select v-model="quizForm.type">
                      <option value="practice">Practice</option>
                      <option value="exam">Exam</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Duration (minutes)</label>
                    <div class="input-with-unit">
                      <input v-model.number="quizForm.duration" type="number" min="1" />
                    </div>
                  </div>
                </div>
                <button class="primary-button" @click="createQuiz">Create Quiz</button>
              </div>
            </div>
          </div>
        </section>

        <section class="quiz-section">
          <h2>Available MCQs</h2>
          <div v-if="quizzes.length === 0" class="empty-box">No MCQs yet.</div>
          <ul class="quiz-list">
            <li v-for="quiz in quizzes" :key="quiz.quiz_id" class="quiz-item">
              <div>
                <h3>{{ quiz.title }}</h3>
                <small class="module-badge">{{ quiz.module_title }}</small>
              </div>
              <div class="quiz-actions">
                <button
                  v-if="isTeacher"
                  class="delete-button"
                  @click.stop="deleteQuiz(quiz.quiz_id || quiz.id)"
                  title="Delete Quiz"
                >
                  delete
                </button>
                <button
                  v-if="isTeacher || quiz.type === 'practice' || !quiz.last_attempt"
                  @click="openQuiz(quiz)"
                >
                  {{ quiz.type === 'practice' && quiz.last_attempt ? 'Try Again' : 'Open' }}
                </button>

                <span v-if="quiz.last_attempt" class="score-badge">
                  Score:
                  {{
                    quiz.max_points_possible > 0
                      ? ((quiz.last_attempt.score / quiz.max_points_possible) * 20).toFixed(2)
                      : '0.00'
                  }}
                  / 20
                </span>
              </div>
            </li>
          </ul>
        </section>
      </template>
    </main>
  </div>
  <Footer />
</template>

<style scoped>
/* variables and resets */
:deep(body) {
  background-color: #f1f5f9;
}

.course-page {
  min-height: 100vh;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
  color: #1e293b;
  line-height: 1.5;
}

.content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* buttons */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 10px 18px;
  border-radius: 12px;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 32px;
}

.back-button:hover {
  background: #f8fafc;
  color: #4f46e5;
  border-color: #4f46e5;
  transform: translateX(-4px);
}

.primary-button {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
  transition: all 0.2s;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
  filter: brightness(1.1);
}

.secondary-button {
  background: #ffffff;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* course header */
.course-info {
  background: white;
  padding: 48px;
  border-radius: 32px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  margin-bottom: 48px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.03),
    0 10px 10px -5px rgba(0, 0, 0, 0.01);
  position: relative;
  overflow: hidden;
}

.course-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
}

.course-info h1 {
  font-size: 2.75rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 16px;
  letter-spacing: -0.04em;
}

.course-info p {
  font-size: 1.125rem;
  color: #64748b;
  max-width: 800px;
  margin-bottom: 32px;
}

.course-details {
  display: flex;
  gap: 12px;
}

.course-details span {
  background: #f1f5f9;
  padding: 6px 16px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

/* teacher dashboard - */
.teacher-course-panel {
  margin-top: 48px;
  padding-top: 40px;
  border-top: 1px solid #f1f5f9;
}

.admin-card {
  background: #fcfcfd;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  transition: border-color 0.3s;
}

.admin-card:hover {
  border-color: #cbd5e1;
}

.admin-card h3 {
  font-size: 1.1rem;
  margin-bottom: 16px;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* formulaire */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* mcq section */
.quiz-section h2 {
  font-size: 1.75rem;
  margin-bottom: 24px;
  font-weight: 700;
}

.quiz-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  list-style: none;
  padding: 0;
}

.quiz-item {
  background: white;
  padding: 28px;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.quiz-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  border-color: #6366f1;
}

.quiz-item h3 {
  font-size: 1.25rem;
  color: #0f172a;
  margin-bottom: 8px;
}

.module-badge {
  display: inline-block;
  background: #eef2ff;
  color: #4f46e5;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quiz-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

/* score */
.score-badge {
  background: #dcfce7;
  color: #166534;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
}

/* messages */
.success-message {
  background: #f0fdf4;
  color: #15803d;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #bbf7d0;
  margin-bottom: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.empty-box {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px dashed #e2e8f0;
  border-radius: 24px;
  color: #94a3b8;
}

/* animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quiz-item {
  animation: fadeIn 0.4s ease forwards;
}

.score-badge {
  background: #e0f2fe;
  color: #0369a1;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  border: 1px solid #bae6fd;
  display: inline-block;
  min-width: 100px;
  text-align: center;
}

/* Tablet */
@media (max-width: 1024px) {
  .content {
    padding: 32px 16px;
  }

  .course-info {
    padding: 32px;
  }

  .course-info h1 {
    font-size: 2rem;
  }

  .course-info p {
    font-size: 1rem;
  }

  .course-details {
    flex-wrap: wrap;
  }

  .teacher-course-panel {
    margin-top: 32px;
  }

  .form-row {
    grid-template-columns: 1fr !important;
  }

  .quiz-list {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

/* Quiz action buttons */
.quiz-actions button {
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  min-height: 44px;
  box-sizing: border-box;
}

/* Open button (primary action) */
.quiz-actions button:not(.delete-button) {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}

.quiz-actions button:not(.delete-button):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
  filter: brightness(1.05);
}

.quiz-actions button:not(.delete-button):active {
  transform: translateY(0);
  box-shadow: 0 2px 4px -1px rgba(79, 70, 229, 0.2);
}

/* Delete button (danger action) */
.delete-button {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  font-size: 0.8rem;
  padding: 8px 16px;
  min-height: 40px;
}

.delete-button:hover {
  background: #fecaca;
  color: #b91c1c;
  border-color: #f87171;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 38, 38, 0.15);
}

.delete-button:active {
  background: #fecaca;
  transform: translateY(0);
}

/* Mobile */
@media (max-width: 768px) {
  .content {
    padding: 24px 12px;
    max-width: 100%;
  }

  .back-button {
    padding: 8px 12px;
    font-size: 0.85rem;
    margin-bottom: 20px;
  }

  .course-info {
    padding: 20px;
    margin-bottom: 32px;
    border-radius: 20px;
  }

  .course-info::before {
    height: 4px;
  }

  .course-info h1 {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }

  .course-info p {
    font-size: 0.95rem;
    margin-bottom: 20px;
  }

  .course-details {
    flex-direction: column;
    gap: 8px;
  }

  .course-details span {
    font-size: 0.8rem;
    padding: 4px 12px;
  }

  .teacher-course-panel {
    margin-top: 20px;
    padding-top: 20px;
  }

  .admin-card {
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 16px;
  }

  .admin-card h3 {
    font-size: 1rem;
    margin-bottom: 12px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-group label {
    font-size: 0.8rem;
    margin-bottom: 4px;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: 10px 12px;
    font-size: 16px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .input-with-unit {
    display: flex;
    align-items: center;
  }

  .input-with-unit input {
    flex: 1;
  }

  .primary-button {
    width: 100%;
    padding: 10px 16px;
    font-size: 0.9rem;
  }

  .quiz-section h2 {
    font-size: 1.35rem;
    margin-bottom: 16px;
  }

  .quiz-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .quiz-item {
    padding: 16px;
    gap: 12px;
  }

  .quiz-item h3 {
    font-size: 1.1rem;
    margin-bottom: 4px;
  }

  .quiz-actions {
    flex-wrap: wrap;
    gap: 8px;
  }

  .quiz-actions button {
    flex: 1;
    min-width: 100px;
    padding: 8px 12px;
    font-size: 0.85rem;
  }

  .delete-button {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .empty-box {
    padding: 40px 20px;
    font-size: 0.9rem;
  }

  .help-text {
    font-size: 0.85rem;
  }

  .module-creation,
  .quiz-creation {
    margin-bottom: 16px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .content {
    padding: 16px 8px;
  }

  .course-info {
    padding: 16px;
  }

  .course-info h1 {
    font-size: 1.25rem;
    line-height: 1.3;
  }

  .course-info p {
    font-size: 0.9rem;
  }

  .back-button {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .admin-card h3 {
    font-size: 0.95rem;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: 8px 10px;
    font-size: 16px;
  }

  .quiz-item {
    padding: 12px;
  }

  .quiz-item h3 {
    font-size: 1rem;
  }

  .quiz-actions {
    flex-direction: column;
  }

  .quiz-actions button,
  .quiz-actions span {
    width: 100%;
  }

  @media (max-width: 768px) {
    .quiz-actions button {
      padding: 10px 16px;
      font-size: 0.85rem;
      flex: 1;
      min-width: 90px;
    }
    
    .delete-button {
      padding: 8px 14px;
      font-size: 0.8rem;
      order: 3; /* Delete button last on mobile */
    }
    
    .quiz-actions {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: space-between;
    }
  }

  @media (max-width: 480px) {
    .quiz-actions button {
      padding: 10px 12px;
      font-size: 0.8rem;
    }
    
    .delete-button {
      padding: 8px 12px;
      font-size: 0.75rem;
    }
  }
}
</style>
