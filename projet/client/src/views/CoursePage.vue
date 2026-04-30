<script setup>
import { ref, onMounted } from 'vue'
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

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }

  if (user.value.role !== 'student') {
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

      return quizData.map((quiz) => ({
        ...quiz,
        module_title: module.title,
      }))
    })

    const quizzesByModule = await Promise.all(quizRequests)
    quizzes.value = quizzesByModule.flat()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/student')
}

function openQuiz(quizId) {
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

              <button @click="openQuiz(quiz.quiz_id)">Open MCQ</button>
            </li>
          </ul>
        </section>
      </template>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
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
.empty-box {
  padding: 1rem;
  border-radius: 12px;
  font-weight: 800;
}

.message,
.empty-box {
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
