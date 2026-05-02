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
const quizForm = ref({ module_id: '', title: '', description: '', type: 'practice' })
const editingQuizId = ref(null)
const editQuiz = ref({ title: '', description: '', type: 'practice' })
const quizError = ref('')
const quizMessage = ref('')
const courseMessage = ref('')

const loading = ref(true)
const error = ref('')
const isTeacher = computed(() => String(user.value?.role || '').toLowerCase() === 'teacher')

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }

  if (user.value.role !== 'student' && user.value.role !== 'teacher') {
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

    const courseResponse = await fetch(`http://localhost:3000/api/courses/${courseId}`)
    const courseData = await courseResponse.json()

    if (!courseResponse.ok) {
      throw new Error(courseData.message || courseData.error || 'Failed to load course')
    }

    course.value = courseData
    courseForm.value = {
      title: courseData.title || '',
      short_description: courseData.short_description || '',
    }

    const modulesResponse = await fetch(`http://localhost:3000/api/modules/course/${courseId}`)
    const modulesData = await modulesResponse.json()

    if (!modulesResponse.ok) {
      throw new Error(modulesData.message || modulesData.error || 'Failed to load modules')
    }

    modules.value = modulesData

    const quizRequests = modules.value.map(async (module) => {
      const quizResponse = await fetch(
        `http://localhost:3000/api/quizzes/module/${module.module_id}`,
      )
      const quizData = await quizResponse.json()

      if (!quizResponse.ok) {
        throw new Error(quizData.message || quizData.error || 'Failed to load quizzes')
      }

      const quizzesWithAttempts = await Promise.all(
        quizData.map(async (quiz) => {
          const attemptsResponse = await fetch(
            `http://localhost:3000/api/attempts/student/${user.value.user_id}/quiz/${quiz.quiz_id}`,
          )

          const attemptsData = await attemptsResponse.json()

          if (!attemptsResponse.ok) {
            throw new Error(attemptsData.message || attemptsData.error || 'Failed to load attempts')
          }

          return {
            ...quiz,
            module_title: module.title,
            last_attempt: attemptsData.length > 0 ? attemptsData[0] : null,
          }
        }),
      )

      return quizzesWithAttempts
    })

    const quizzesByModule = await Promise.all(quizRequests)
    quizzes.value = quizzesByModule.flat()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function updateCourse() {
  if (!courseForm.value.title.trim()) {
    error.value = 'Please enter a course title.'
    return
  }

  error.value = ''
  courseMessage.value = ''
  loading.value = true

  try {
    const response = await fetch(`http://localhost:3000/api/courses/${course.value.course_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: courseForm.value.title,
        short_description: courseForm.value.short_description,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to update course')
    }

    courseMessage.value = 'Course updated successfully.'
    await fetchCourseData()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function createQuiz() {
  if (!quizForm.value.module_id) {
    quizError.value = 'Please select a module.'
    return
  }
  if (!quizForm.value.title.trim()) {
    quizError.value = 'Please enter a quiz title.'
    return
  }

  quizError.value = ''
  quizMessage.value = ''

  try {
    const response = await fetch('http://localhost:3000/api/quizzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        module_id: quizForm.value.module_id,
        title: quizForm.value.title,
        description: quizForm.value.description,
        type: quizForm.value.type,
        teacher_id: user.value.user_id,
        is_published: 1,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to create quiz')
    }

    quizMessage.value = 'Quiz created successfully.'
    quizForm.value = { module_id: '', title: '', description: '', type: 'practice' }
    await fetchCourseData()
  } catch (err) {
    quizError.value = err.message
  }
}

function startQuizEdit(quiz) {
  editingQuizId.value = quiz.quiz_id
  editQuiz.value = {
    title: quiz.title || '',
    description: quiz.description || '',
    type: quiz.type || 'practice',
  }
  quizError.value = ''
  quizMessage.value = ''
}

async function updateQuiz(quizId) {
  if (!editQuiz.value.title.trim()) {
    quizError.value = 'Please enter a quiz title.'
    return
  }

  quizError.value = ''
  quizMessage.value = ''

  try {
    const response = await fetch(`http://localhost:3000/api/quizzes/${quizId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: editQuiz.value.title,
        description: editQuiz.value.description,
        type: editQuiz.value.type,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to update quiz')
    }

    quizMessage.value = 'Quiz updated successfully.'
    editingQuizId.value = null
    await fetchCourseData()
  } catch (err) {
    quizError.value = err.message
  }
}

function goBack() {
  if (user.value?.role === 'teacher') {
    router.push('/teacher')
  } else {
    router.push('/student')
  }
}

function openQuiz(quiz) {
  const quizId = quiz?.quiz_id || quiz?.id
  if (!quizId) {
    error.value = 'Unable to open this quiz. Invalid quiz identifier.'
    return
  }

  // On envoie TOUT LE MONDE (Teacher et Student) sur la page du quiz
  router.push(`/quizzes/${quizId}`)
}
</script>

<template>
  <div class="course-page">
    <Header :user="user" />

    <main class="content">
      <button class="back-button" @click="goBack">← Back to courses</button>

      <p v-if="loading" class="message">Loading course...</p>

      <p v-else-if="error" class="error-message">
        {{ error }}
      </p>

      <template v-else>
        <section class="course-info">
          <h1>{{ course?.title }}</h1>

          <p>
            {{ course?.short_description || 'No description available for this course.' }}
          </p>

          <div class="course-details">
            <span>Code: {{ course?.join_code || 'N/A' }}</span>
            <span>Status: {{ course?.is_published ? 'Published' : 'Draft' }}</span>
            <span>MCQs: {{ quizzes.length }}</span>
          </div>

          <div v-if="isTeacher" class="teacher-course-panel">
            <h2>Teacher controls</h2>
            <div v-if="courseMessage" class="success-message">{{ courseMessage }}</div>
            <div class="form-group">
              <label>Course title</label>
              <input v-model="courseForm.title" type="text" />
            </div>
            <div class="form-group">
              <label>Course description</label>
              <textarea v-model="courseForm.short_description" rows="3"></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="secondary-button" @click="fetchCourseData">Reset</button>
              <button type="button" class="primary-button" @click="updateCourse">Save course</button>
            </div>

            <div class="quiz-management">
              <h3>Create a new quiz</h3>
              <div v-if="quizError" class="error-message">{{ quizError }}</div>
              <div v-if="quizMessage" class="success-message">{{ quizMessage }}</div>
              <div v-if="modules.length === 0" class="empty-box">
                No modules found for this course. Create a module first to add quizzes.
              </div>
              <div v-else>
                <div class="form-group">
                  <label>Module</label>
                  <select v-model="quizForm.module_id">
                    <option value="" disabled>Select module</option>
                    <option v-for="module in modules" :key="module.module_id" :value="module.module_id">
                      {{ module.title }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Quiz title</label>
                  <input v-model="quizForm.title" type="text" />
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <input v-model="quizForm.description" type="text" />
                </div>
                <div class="form-group">
                  <label>Type</label>
                  <select v-model="quizForm.type">
                    <option value="practice">Practice</option>
                    <option value="exam">Exam</option>
                  </select>
                </div>
                <div class="form-actions">
                  <button type="button" class="primary-button" @click="createQuiz">Create quiz</button>
                </div>
              </div>
            </div>

            <div v-if="quizzes.length > 0" class="quiz-management">
              <h3>Existing quizzes</h3>
              <ul class="quiz-management-list">
                <li v-for="quiz in quizzes" :key="quiz.quiz_id" class="quiz-item-panel">
                  <div>
                    <strong>{{ quiz.title }}</strong>
                    <span class="module-badge">Module: {{ quiz.module_title }}</span>
                  </div>
                  <div class="quiz-actions">
                    <button type="button" class="secondary-button" @click="startQuizEdit(quiz)">Edit</button>
                  </div>
                  <div v-if="editingQuizId === quiz.quiz_id" class="quiz-edit-panel">
                    <div class="form-group">
                      <label>Title</label>
                      <input v-model="editQuiz.title" type="text" />
                    </div>
                    <div class="form-group">
                      <label>Description</label>
                      <input v-model="editQuiz.description" type="text" />
                    </div>
                    <div class="form-group">
                      <label>Type</label>
                      <select v-model="editQuiz.type">
                        <option value="practice">Practice</option>
                        <option value="exam">Exam</option>
                      </select>
                    </div>
                    <div class="form-actions">
                      <button type="button" class="secondary-button" @click="editingQuizId = null">Cancel</button>
                      <button type="button" class="primary-button" @click="updateQuiz(quiz.quiz_id)">Save quiz</button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section class="quiz-section">
          <h2>Available MCQs</h2>

          <div v-if="quizzes.length === 0" class="empty-box">
            No MCQs available for this course yet.
          </div>

              <ul v-else class="quiz-list">
            <li v-for="quiz in quizzes" :key="quiz.quiz_id" class="quiz-item">
              <div>
                <h3>{{ quiz.title }}</h3>
                <p>{{ quiz.description || 'No description available.' }}</p>
                <small>Module: {{ quiz.module_title }}</small>
              </div>

              <button
                v-if="isTeacher || (user?.role === 'student' && (quiz.type !== 'exam' || !quiz.last_attempt))"
                @click="openQuiz(quiz)"
              >
                {{ isTeacher ? 'Open quiz' : 'Open MCQ' }}
              </button>

              <div v-else-if="quiz.last_attempt" class="score-badge">
                Score: {{ quiz.last_attempt.score }}
              </div>

              <div v-else class="info-message">
                Only students can open this quiz.
              </div>
            </li>
          </ul>
        </section>
      </template>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.score-badge {
  min-width: 120px;
  padding: 0.75rem 1rem;
  text-align: center;
  border-radius: 10px;
  background: #dcfce7;
  color: #166534;
  font-weight: 900;
}

.course-page {
  min-height: 100vh;
  background: #ffffff;
  color: #02143a;
  font-family: Arial, sans-serif;
}

.content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.back-button {
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  background: #f0f0f4;
  color: #05051f;
  font-weight: 800;
  cursor: pointer;
}

.back-button:hover {
  opacity: 0.85;
}

.course-info {
  padding: 2rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(5, 12, 27, 0.05);
}

.course-info h1 {
  margin: 0 0 1rem;
  color: #05051f;
  font-size: 2.2rem;
}

.course-info p {
  margin: 0;
  color: #747789;
  line-height: 1.6;
}

.course-details {
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.course-details span {
  padding: 0.45rem 0.8rem;
  background: #f7f7fb;
  border-radius: 999px;
  color: #05051f;
  font-size: 0.9rem;
  font-weight: 800;
}

.quiz-section {
  margin-top: 2.5rem;
}

.quiz-section h2 {
  margin: 0 0 1rem;
  color: #05051f;
  font-size: 1.8rem;
}

.quiz-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.quiz-item {
  padding: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(5, 12, 27, 0.04);
}

.quiz-item h3 {
  margin: 0 0 0.4rem;
  color: #05051f;
  font-size: 1.1rem;
}

.quiz-item p {
  margin: 0 0 0.4rem;
  color: #747789;
}

.quiz-item small {
  color: #747789;
  font-weight: 700;
}

.quiz-item button {
  min-width: 120px;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  background: #05051f;
  color: white;
  font-weight: 800;
  cursor: pointer;
}

.quiz-item button:hover {
  opacity: 0.92;
}

.message,
.error-message,
.success-message,
.empty-box {
  padding: 1rem;
  border-radius: 12px;
  font-weight: 800;
}

.message,
.empty-box,
.success-message {
  background: #f7f7fb;
  color: #05051f;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 700px) {
  .content {
    padding: 2rem 1rem;
  }

  .quiz-item {
    align-items: flex-start;
    flex-direction: column;
  }

  .quiz-item button {
    width: 100%;
  }

  .course-info h1 {
    font-size: 1.8rem;
  }
}
</style>
