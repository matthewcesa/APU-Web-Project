<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/PageHeader.vue'
import Footer from '../components/PageFooter.vue'

const router = useRouter()

const user = ref(null)
const courses = ref([])
const loading = ref(true)
const error = ref('')
const success = ref('')

const showCreateForm = ref(false)

const form = ref({
  join_code: Math.floor(Math.random() * 900) + 100,
  title: '',
  slug: '',
  short_description:'',
  is_published: '1',
  visibility: 'public',
  
})

var count = 0

function getCourseColor() {
  const colors = [
    '#0022ff',
    '#00ffae',
    '#ff0000',
    '#5d00ff',
    '#ff5900',
    '#00ccff',
    '#ffae00',
    '#00ff26',
    '#ff00c8',
    '#f6ff00',
  ]
  count += 1
  if (count > colors.length) count = 0
  return colors[count]
}

onMounted(async () => {
  const storedUser = localStorage.getItem('user')

  if (!storedUser) {
    router.push('/login')
    return
  }
  
  let userData = JSON.parse(storedUser)
  if (typeof userData === 'string') {
    userData = JSON.parse(userData)
  }

  user.value = userData

  if (user.value && user.value.user_id) {
    await fetchteacherCourses()
  } else {
    router.push('/login')
  }
})

async function fetchteacherCourses() {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(
      `http://localhost:3000/api/courses/teacher/${user.value.user_id}`
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to load courses')
    courses.value = data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }



function toggleForm() {
  showCreateForm.value = !showCreateForm.value
  error.value = ''
  success.value = ''
}

function resetForm() {
  form.value = {
    join_code:'',
    title: '',
    slug:'',
    short_description:'',
  }
}
function goToCourse(courseId) {
  router.push(`/courses/${courseId}`)

}
async function createCourse(){
  error.value = ''
  success.value = ''
  loading.value = true
  try{
    const response = await fetch('http://localhost:3000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({
        ...form.value,
        teacher_id: user.value.user_id,
      }),
      
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to create course')
    }

    success.value = 'Course created successfully.'
    resetForm()
    showCreateForm.value = false

    await fetchteacherCourses()
  }catch(err) { 
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="teacher-page">
    <Header :user="user" />

    <main class="content">
      <section class="page-intro">
        <div>
          <p class="eyebrow">teacher space</p>
          <h1>Available Courses</h1>
          <p>Explore your enrolled courses and start your learning journey.</p>
        </div>
      </section>


      <p v-if="loading" class="info-message">Loading your courses...</p>

      <p v-else-if="error" class="error-message">
        {{ error }}
      </p>

      <section v-else-if="courses.length === 0" class="empty-state">
        <h2>No courses yet</h2>
        <p>You are not enrolled in any course for now.</p>
      </section>

      <section v-else class="courses-grid">
        <article
          v-for="course in courses"
          :key="course.course_id"
          class="course-card"
          @click="goToCourse(course.course_id)"
        >
          <div class="course-cover" :style="{ background: getCourseColor(course.course_id) }">
            <span class="course-status">
              {{ course.is_published ? 'Published' : 'Draft' }}
            </span>
          </div>

          <div class="course-content">
            <h2>{{ course.title }}</h2>

            <p class="course-description">
              {{ course.short_description || 'No description for this course.' }}
            </p>

            <div class="course-meta">
              <span>Course</span>
              <span v-if="course.join_code">Code: {{ course.join_code }}</span>
            </div>

            <button type="button" class="open-button">Open course</button>
          </div>
        </article>
      </section>
      <section class="create-course">
        <div>
          <p>Manage and create new courses for the platform.</p>
        </div>
        <button class="primary-button" @click="toggleForm">
          {{ showCreateForm ? 'Cancel' : '+ Create Course' }}
        </button> 
      </section>
      <section v-if="showCreateForm" class="form-section">
        <h2>Create a new Course</h2>

        <form @submit.prevent="createCourse">
          <div class="form-grid">
            <div class="form-group">
              <label>Title</label>
              <input v-model="form.title" type="text" placeholder="Advanced Web Programming" />
            </div>

            <div class="form-group">
              <label>Slug</label>
              <input v-model="form.slug" type="text" placeholder="advanced-web-programming" />
            </div>

            <div class="form-group">
              <label>Short description</label>
              <input v-model="form.short_description" type="text" placeholder="This course is supposed to ..." />
            </div> 
          </div>
          <div class="form-actions">
            <button type="button" class="secondary-button" @click="resetForm">Reset</button>

            <button type="submit" class="primary-button" :disabled="loading">
              {{ loading ? 'Creating...' : 'Create Course' }}
            </button>
          </div>
        </form>
      </section>
    </main>
  </div>

  <Footer/>
</template>

<style scoped>
.teacher-page {
  min-height: 100vh;
  background: #ffffff;
  color: #02143a;
  font-family: Arial, sans-serif;
}

.navbar {
  height: 72px;
  padding: 0 12%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-bottom: 1px solid #e5e5e5;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: #05051f;
}

.brand-logo {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

nav {
  display: flex;
  gap: 1.5rem;
}

nav a {
  color: #040a18;
  text-decoration: none;
  font-weight: 500;
}

nav a:hover {
  opacity: 0.8;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #747789;
  font-weight: 600;
}

.logout-button {
  padding: 0.75rem 1.2rem;
  border: none;
  border-radius: 12px;
  background: #05051f;
  color: white;
  font-weight: 800;
  cursor: pointer;
}

.logout-button:hover {
  opacity: 0.92;
}

.content {
  max-width: 1360px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.page-intro {
  margin-bottom: 2rem;
}

.eyebrow {
  margin: 0 0 0.55rem;
  color: #747789;
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.page-intro h1 {
  margin: 0 0 0.6rem;
  color: #05051f;
  font-size: 2rem;
}

.page-intro p {
  margin: 0;
  color: #747789;
  font-size: 1.05rem;
  line-height: 1.6;
}

.info-message,
.error-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 14px;
  font-weight: 800;
}

.info-message {
  background: #f7f7fb;
  color: #05051f;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
}

.empty-state {
  margin-top: 1.5rem;
  padding: 3rem 2rem;
  text-align: center;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  box-shadow: 0 14px 35px rgba(5, 12, 27, 0.05);
}

.empty-state span {
  display: block;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.empty-state h2 {
  margin: 0 0 0.5rem;
  color: #05051f;
}

.empty-state p {
  margin: 0;
  color: #747789;
}

.courses-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.8rem;
}

.course-card {
  overflow: hidden;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(5, 12, 27, 0.04);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  border-color: #c9c9c9;
  box-shadow: 0 18px 45px rgba(5, 12, 27, 0.1);
}

.course-cover {
  position: relative;
  height: 145px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0));
}

.course-status {
  position: absolute;
  z-index: 2;
  top: 1rem;
  right: 1rem;
  padding: 0.35rem 0.75rem;
  background: rgba(255, 255, 255, 0.92);
  color: #05051f;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 900;
}

.course-content {
  padding: 1.6rem;
}

.course-content h2 {
  margin: 0;
  color: #05051f;
  font-size: 1.25rem;
  line-height: 1.25;
}

.course-description {
  min-height: 52px;
  margin: 0.9rem 0 1.2rem;
  color: #747789;
  font-size: 0.98rem;
  line-height: 1.55;
}

.course-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
  color: #747789;
  font-size: 0.9rem;
  font-weight: 700;
}

.open-button {
  width: 100%;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 12px;
  background: #05051f;
  color: white;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
}

.open-button:hover {
  opacity: 0.92;
}

@media (max-width: 1050px) {
  .navbar {
    padding: 0 2rem;
  }

  nav {
    display: none;
  }

  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 720px) {
  .navbar {
    height: auto;
    padding: 1rem 1.5rem;
    flex-direction: column;
    gap: 1rem;
  }

  .user-area {
    flex-direction: column;
  }

  .content {
    padding: 2rem 1rem;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }

  .page-intro h1 {
    font-size: 1.8rem;
  }

  .course-meta {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
