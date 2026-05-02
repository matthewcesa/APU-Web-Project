<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/web_project_logo.png'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function goToHome() {
  router.push('/')
}

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Login failed')
    }

    localStorage.setItem('user', JSON.stringify(data.user))

    if (data.user.role === 'student') {
      router.push('/student')
    } else if (data.user.role === 'teacher') {
      router.push('/teacher')
    } else if (data.user.role === 'admin') {
      router.push('/admin')
    } else {
      throw new Error('Unknown user role')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <button class="back-home-button" @click="goToHome">← Back to home</button>

    <section class="login-card">
      <div class="brand">
        <img :src="logo" alt="MCQoodle logo" class="brand-logo" />
        <h1>MCQoodle</h1>
      </div>

      <p class="subtitle">Login to access your learning space.</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="student@test.com" />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Your password" />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f7f7fb;
  font-family: Arial, sans-serif;
}

.back-home-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  width: auto;
  margin: 0;
  padding: 0.75rem 1.1rem;
  border: none;
  border-radius: 12px;
  background: white;
  color: #05051f;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.back-home-button:hover {
  opacity: 0.9;
}

.login-card {
  width: 100%;
  max-width: 430px;
  padding: 2.2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.5rem;
}

.brand-logo {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.brand h1 {
  margin: 0;
  font-size: 1.35rem;
  color: #05051f;
}

.subtitle {
  margin-bottom: 1.8rem;
  color: #747789;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.4rem;
  color: #111827;
  font-weight: 700;
}

input {
  padding: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 11px;
  font-size: 1rem;
  outline: none;
}

input:focus {
  border-color: #05051f;
}

form button {
  width: 100%;
  margin-top: 1rem;
  padding: 0.95rem;
  border: none;
  border-radius: 12px;
  background: #05051f;
  color: white;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
}

form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  padding: 0.8rem;
  margin-top: 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 10px;
  font-weight: 700;
}

@media (max-width: 700px) {
  .back-home-button {
    position: static;
    margin-bottom: 1rem;
  }

  .login-page {
    flex-direction: column;
    align-items: stretch;
  }

  .login-card {
    max-width: none;
    padding: 1.8rem;
  }

  .brand h1 {
    font-size: 1.2rem;
  }

  .brand-logo {
    width: 38px;
    height: 38px;
  }

  .subtitle {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 0.8rem;
  }

  label {
    font-size: 0.9rem;
  }

  input {
    padding: 0.75rem;
    font-size: 16px;
  }

  form button {
    padding: 0.85rem;
    font-size: 0.95rem;
  }

  .error {
    font-size: 0.9rem;
    padding: 0.7rem;
    margin-top: 0.8rem;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 1rem;
    min-height: 100vh;
    justify-content: center;
  }

  .back-home-button {
    margin-bottom: 0.8rem;
    padding: 0.6rem 0.9rem;
    font-size: 0.85rem;
  }

  .login-card {
    padding: 1.5rem 1rem;
    border-radius: 16px;
    width: 100%;
  }

  .brand {
    gap: 0.5rem;
    margin-bottom: 0.3rem;
  }

  .brand-logo {
    width: 35px;
    height: 35px;
  }

  .brand h1 {
    font-size: 1.1rem;
  }

  .subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }

  .form-group {
    margin-bottom: 0.7rem;
  }

  label {
    font-size: 0.85rem;
    margin-bottom: 0.3rem;
  }

  input {
    padding: 0.65rem;
    font-size: 16px;
    border-radius: 8px;
  }

  form button {
    width: 100%;
    margin-top: 0.8rem;
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .error {
    font-size: 0.85rem;
    padding: 0.6rem;
    border-radius: 8px;
  }
}
</style>
