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
    if (!form.value.title.trim()) {
      throw new Error('Course title is required.')
    }

    const titlePrefix = form.value.title.slice(0, 3).toUpperCase().padEnd(3, 'X')
    const randomNumbers = Math.floor(Math.random() * 900) + 100
    const generatedJoinCode = titlePrefix + randomNumbers

    const response = await fetch('http://localhost:3000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({
        ...form.value,
        join_code: generatedJoinCode,
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

async function deleteCourse(courseId, event) {
  event.stopPropagation()

  if (!confirm("Are you sure you want to delete this course definitively? All associated modules and quizzes will be lost.")) {
    return
  }

  loading.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to delete course')
    }

    courses.value = courses.value.filter(c => c.course_id !== courseId)
    success.value = "Course deleted successfully."
    setTimeout(() => { success.value = '' }, 3000)

  } catch (err) {
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

            
            <button 
              class="delete-course-btn" 
              @click.stop="deleteCourse(course.course_id, $event)"
              title="Delete course"
            >
              delete
            </button>

          
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
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.page-intro {
  margin-bottom: 48px;
  border-left: 4px solid #6366f1;
  padding-left: 24px;
}

.eyebrow {
  color: #6366f1;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
}

.page-intro h1 {
  font-size: 2.5rem;
  color: #0f172a;
  margin: 8px 0;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.course-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #6366f1;
}

.course-cover {
  height: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-status {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  color: white;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 700;
  border: 1px solid rgba(255,255,255,0.3);
}

.course-content {
  padding: 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-content h2 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 12px;
}

.course-description {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.course-meta {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
}

.create-course {
  margin-top: 60px;
  padding: 40px;
  background: #0f172a;
  border-radius: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.primary-button {
  background: #6366f1;
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-button:hover {
  background: #4f46e5;
  transform: scale(1.02);
}

.form-section {
  margin-top: 30px;
  background: white;
  padding: 32px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #475569;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

/* Bouton delete sur une course */
.delete-course-btn {
  margin-top: 16px;
  align-self: flex-start;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.delete-course-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(220, 38, 38, 0.18);
}

.delete-course-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.15);
}

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .create-course { flex-direction: column; text-align: center; }
}


</style>