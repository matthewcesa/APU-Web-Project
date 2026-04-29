<script setup>
import { useRouter } from 'vue-router'
import logo from '../assets/web_project_logo.png'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <main class="landing-page">
    <header class="navbar">
      <div class="brand" @click="goToLogin">
        <img :src="logo" alt="Platform logo" class="brand-logo" />
        <span>MCQoodle</span>
      </div>

      <nav>
        <a href="" @click.prevent="goToLogin">Home</a>
        <a href="#">About the project</a>
        <a href="#">About our team</a>
        <a href="#">Contact</a>
      </nav>

      <button class="navbar-login-button" @click="goToLogin">Login</button>
    </header>

    <section class="hero">
      <div class="hero-card">
        <h1>Welcome to our Advanced Web Development Project for APU : MCQoodle</h1>
        <p>
          Our team is pleased to present this website. It is a platform inspired by Moodle, designed
          for teachers to create MCQs and for students to practice or take exams online.
        </p>

        <button @click="goToLogin">Login</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.landing-page {
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
  border-bottom: 1px solid #d1d1d1;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.25rem;
  font-weight: 800;
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

.navbar-login-button {
  padding: 0.75rem 1.4rem;
  border: none;
  border-radius: 12px;
  background: #05051f;
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
}

.navbar-login-button:hover {
  opacity: 0.92;
}

.hero {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.hero-card {
  width: 100%;
  max-width: 720px;
  padding: 4rem 3rem;
  text-align: center;
  background: white;
  border-radius: 22px;
  box-shadow: 0 18px 45px rgba(5, 12, 27, 0.08);
}

.hero-card h1 {
  max-width: 620px;
  margin: 0 auto 1rem;
  font-size: 3rem;
  line-height: 1.1;
  color: #05051f;
}

.hero-card p {
  max-width: 560px;
  margin: 0 auto 2rem;
  color: #7d7d7d;
  font-size: 1.1rem;
  line-height: 1.6;
}

button {
  padding: 0.95rem 2.2rem;
  border: none;
  border-radius: 12px;
  background: #05051f;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  opacity: 0.92;
}

@media (max-width: 900px) {
  .navbar {
    padding: 0 1.5rem;
  }

  nav {
    gap: 1rem;
  }
}

@media (max-width: 800px) {
  .navbar {
    height: auto;
    padding: 1rem 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .hero-card {
    padding: 3rem 1.5rem;
  }

  .hero-card h1 {
    font-size: 2.2rem;
  }
}
</style>
