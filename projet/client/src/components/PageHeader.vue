<script setup>
import { useRouter } from 'vue-router'
import logo from '../assets/web_project_logo.png'

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: 'guest',
  },
})

const router = useRouter()

function goHome() {
  if (!props.user) {
    router.push('/')
    return
  }

  if (props.user.role === 'student') {
    router.push('/student')
  } else if (props.user.role === 'teacher') {
    router.push('/teacher')
  } else if (props.user.role === 'admin') {
    router.push('/admin')
  } else {
    router.push('/')
  }
}

function goToLogin() {
  router.push('/login')
}

function handleLogout() {
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<template>
  <header class="navbar">
    <div class="brand" @click="goHome">
      <img :src="logo" alt="MCQoodle logo" class="brand-logo" />
      <strong>MCQoodle</strong>
    </div>

    <nav>
      <a href="#" @click.prevent="goHome">Home</a>
      <a href="#">About the Project</a>
      <a href="#">About our Team</a>
      <a href="#">Contacts</a>
    </nav>

    <div v-if="user" class="user-area">
      <span> 👤 {{ user.first_name }} {{ user.last_name }} </span>

      <button class="logout-button" @click="handleLogout">Log out</button>
    </div>

    <button v-else class="login-button" @click="goToLogin">Login</button>
  </header>
</template>

<style scoped>
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
  cursor: pointer;
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

.login-button,
.logout-button {
  padding: 0.75rem 1.2rem;
  border: none;
  border-radius: 12px;
  background: #05051f;
  color: white;
  font-weight: 800;
  cursor: pointer;
}

.login-button:hover,
.logout-button:hover {
  opacity: 0.92;
}

@media (max-width: 1050px) {
  .navbar {
    padding: 0 2rem;
  }

  nav {
    display: none;
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
}
</style>
