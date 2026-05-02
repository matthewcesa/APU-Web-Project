<script setup>
import { ref } from 'vue'
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
const menuOpen = ref(false)

function goHome() {
  menuOpen.value = false
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
  menuOpen.value = false
  router.push('/login')
}

function handleLogout() {
  menuOpen.value = false
  localStorage.removeItem('user')
  router.push('/')
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
</script>

<template>
  <header class="navbar">
    <div class="brand" @click="goHome">
      <img :src="logo" alt="MCQoodle logo" class="brand-logo" />
      <strong>MCQoodle</strong>
    </div>

    <nav :class="{ active: menuOpen }" class="nav-menu">
      <a href="#" @click.prevent="goHome">Home</a>
      <a href="#">About the Project</a>
      <a href="#">About our Team</a>
      <a href="#">Contacts</a>
    </nav>

    <div class="nav-actions">
      <div v-if="user" class="user-area">
        <span class="user-name">👤 {{ user.first_name }} {{ user.last_name }}</span>
        <button class="logout-button" @click="handleLogout">Log out</button>
      </div>

      <button v-else class="login-button" @click="goToLogin">Login</button>
    </div>

    <button class="menu-toggle" @click="toggleMenu" :aria-label="menuOpen ? 'Close menu' : 'Open menu'">
      <span></span>
      <span></span>
      <span></span>
    </button>
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
  position: relative;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: #05051f;
  cursor: pointer;
  z-index: 10;
}

.brand-logo {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-menu a {
  color: #040a18;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.nav-menu a:hover {
  opacity: 0.8;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #747789;
  font-weight: 600;
}

.user-name {
  display: block;
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
  transition: opacity 0.2s;
}

.login-button:hover,
.logout-button:hover {
  opacity: 0.92;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 0.35rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 11;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background: #05051f;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Tablet & Medium screens */
@media (max-width: 1050px) {
  .navbar {
    padding: 0 2rem;
  }

  .nav-menu {
    display: none;
  }
}

/* Mobile screens */
@media (max-width: 768px) {
  .navbar {
    height: auto;
    padding: 1rem 1.5rem;
    flex-wrap: wrap;
    gap: 0;
  }

  .brand {
    font-size: 1.1rem;
    gap: 0.4rem;
  }

  .brand-logo {
    width: 30px;
    height: 30px;
  }

  .menu-toggle {
    display: flex;
  }

  .menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(8px, 8px);
  }

  .menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(8px, -8px);
  }

  .nav-menu {
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    gap: 0;
    border-bottom: 1px solid #e5e5e5;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .nav-menu.active {
    max-height: 500px;
    display: flex;
  }

  .nav-menu a {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .nav-actions {
    width: 100%;
    order: 3;
    margin-top: 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .user-area {
    flex-direction: column;
    width: 100%;
  }

  .user-name {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .login-button,
  .logout-button {
    width: 100%;
  }
}

/* Small mobile screens */
@media (max-width: 480px) {
  .navbar {
    padding: 0.75rem 1rem;
  }

  .brand {
    font-size: 1rem;
  }

  .brand-logo {
    width: 28px;
    height: 28px;
  }

  .user-name {
    font-size: 0.9rem;
  }

  .login-button,
  .logout-button {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
