<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/PageHeader.vue'
import Footer from '../components/PageFooter.vue'

const router = useRouter()

const storedUser = localStorage.getItem('user')
const user = ref(storedUser ? JSON.parse(storedUser) : null)

const users = ref([])
const showCreateForm = ref(false)

const loading = ref(false)
const usersLoading = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role: 'student',
  status: 'active',
})

const totalUsers = computed(() => users.value.length)
const totalStudents = computed(() => users.value.filter((u) => u.role === 'student').length)
const totalTeachers = computed(() => users.value.filter((u) => u.role === 'teacher').length)
const totalAdmins = computed(() => users.value.filter((u) => u.role === 'admin').length)

onMounted(async () => {
  if (!user.value || user.value.role !== 'admin') {
    router.push('/login')
    return
  }

  await fetchUsers()
})

async function fetchUsers() {
  usersLoading.value = true
  error.value = ''

  try {
    const response = await fetch('http://localhost:3000/api/users')
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to load users')
    }

    users.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    usersLoading.value = false
  }
}

function toggleForm() {
  showCreateForm.value = !showCreateForm.value
  error.value = ''
  success.value = ''
}

function resetForm() {
  form.value = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'student',
    status: 'active',
  }
}

async function createUser() {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to create user')
    }

    success.value = 'User created successfully.'
    resetForm()
    showCreateForm.value = false

    await fetchUsers()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <Header :user="user" />

    <main class="content">
      <section class="admin-header">
        <div>
          <h1>Admin dashboard</h1>
          <p>Manage users and create new accounts for the platform.</p>
        </div>

        <button class="primary-button" @click="toggleForm">
          {{ showCreateForm ? 'Cancel' : '+ Create user' }}
        </button>
      </section>

      <section class="stats">
        <div class="stat-box">
          <strong>{{ totalUsers }}</strong>
          <span>Total users</span>
        </div>

        <div class="stat-box">
          <strong>{{ totalStudents }}</strong>
          <span>Students</span>
        </div>

        <div class="stat-box">
          <strong>{{ totalTeachers }}</strong>
          <span>Teachers</span>
        </div>

        <div class="stat-box">
          <strong>{{ totalAdmins }}</strong>
          <span>Admins</span>
        </div>
      </section>

      <p v-if="success" class="success-message">
        {{ success }}
      </p>

      <p v-if="error" class="error-message">
        {{ error }}
      </p>

      <section v-if="showCreateForm" class="form-section">
        <h2>Create a new user</h2>

        <form @submit.prevent="createUser">
          <div class="form-grid">
            <div class="form-group">
              <label>First name</label>
              <input v-model="form.first_name" type="text" placeholder="John" />
            </div>

            <div class="form-group">
              <label>Last name</label>
              <input v-model="form.last_name" type="text" placeholder="Doe" />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" placeholder="john.doe@test.com" />
            </div>

            <div class="form-group">
              <label>Password</label>
              <input v-model="form.password" type="password" placeholder="Temporary password" />
            </div>

            <div class="form-group">
              <label>Role</label>
              <select v-model="form.role">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div class="form-group">
              <label>Status</label>
              <select v-model="form.status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="secondary-button" @click="resetForm">Reset</button>

            <button type="submit" class="primary-button" :disabled="loading">
              {{ loading ? 'Creating...' : 'Create user' }}
            </button>
          </div>
        </form>
      </section>

      <section class="users-section">
        <div class="section-title">
          <div>
            <h2>Users</h2>
            <p>List of registered users on MCQoodle.</p>
          </div>

          <button class="secondary-button" @click="fetchUsers">Refresh</button>
        </div>

        <p v-if="usersLoading" class="info-message">Loading users...</p>

        <p v-else-if="users.length === 0" class="info-message">No users found.</p>

        <ul v-else class="users-list">
          <li v-for="account in users" :key="account.user_id" class="user-row">
            <div>
              <h3>{{ account.first_name }} {{ account.last_name }}</h3>
              <p>{{ account.email }}</p>
            </div>

            <div class="badges">
              <span class="role-badge">
                {{ account.role }}
              </span>

              <span
                class="status-badge"
                :class="account.status === 'active' ? 'active' : 'inactive'"
              >
                {{ account.status }}
              </span>
            </div>
          </li>
        </ul>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.admin-page {
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

.admin-header {
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(5, 12, 27, 0.05);
}

.admin-header h1 {
  margin: 0 0 0.6rem;
  color: #05051f;
  font-size: 2rem;
}

.admin-header p {
  margin: 0;
  color: #747789;
  line-height: 1.6;
}

.stats {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-box {
  padding: 1.2rem;
  background: #f7f7fb;
  border-radius: 14px;
}

.stat-box strong {
  display: block;
  margin-bottom: 0.3rem;
  color: #05051f;
  font-size: 1.6rem;
}

.stat-box span {
  color: #747789;
  font-weight: 800;
}

.form-section,
.users-section {
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(5, 12, 27, 0.05);
}

.form-section h2,
.users-section h2 {
  margin: 0 0 1rem;
  color: #05051f;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.4rem;
  font-weight: 800;
  color: #02143a;
}

input,
select {
  padding: 0.9rem;
  border: 1px solid #d1d1d1;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  background: white;
  color: #02143a;
}

input:focus,
select:focus {
  border-color: #05051f;
}

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.primary-button,
.secondary-button {
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
}

.primary-button {
  background: #05051f;
  color: white;
}

.secondary-button {
  background: #f0f0f4;
  color: #05051f;
}

.primary-button:hover,
.secondary-button:hover {
  opacity: 0.9;
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message,
.error-message,
.info-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 800;
}

.success-message {
  background: #dcfce7;
  color: #166534;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
}

.info-message {
  background: #f7f7fb;
  color: #05051f;
}

.section-title {
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.section-title p {
  margin: 0;
  color: #747789;
}

.users-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.user-row {
  padding: 1rem;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
}

.user-row h3 {
  margin: 0 0 0.3rem;
  color: #05051f;
  font-size: 1rem;
}

.user-row p {
  margin: 0;
  color: #747789;
}

.badges {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.role-badge,
.status-badge {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: capitalize;
}

.role-badge {
  background: #eef2ff;
  color: #1d4ed8;
}

.active {
  background: #dcfce7;
  color: #166534;
}

.inactive {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 800px) {
  .content {
    padding: 2rem 1rem;
  }

  .admin-header,
  .section-title,
  .user-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }

  .badges {
    justify-content: flex-start;
  }
}
</style>
