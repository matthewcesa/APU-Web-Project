<script setup>
import Header from '../components/PageHeader.vue'
import Footer from '../components/PageFooter.vue'

const storedUser = localStorage.getItem('user')
const user = storedUser ? JSON.parse(storedUser) : null
</script>

<template>
  <Header :user="user" />
  <div class="page">
    

    <main class="content">
      <section class="card">
        <p class="eyebrow">About our project</p>
        <h1>MCQoodle</h1>

        <p>
          MCQoodle is a web platform inspired by Moodle. It was created as part of our Advanced Web
          Development project for APU.
        </p>

        <p>
          The goal of the platform is to help teachers create multiple-choice quizzes and help
          students practice or take exams online.
        </p>
      </section>

      <section class="card">
        <h2>What the platform does</h2>

        <ul>
          <li>Students can log in and access their enrolled courses.</li>
          <li>Students can join a course using a course code.</li>
          <li>Students can complete practice MCQs and exam MCQs.</li>
          <li>Teachers can create courses and quizzes and manage them.</li>
          <li>Administrators can create and manage users.</li>
        </ul>
      </section>

      <section class="card">
        <h2>Technologies used</h2>

        <ul>
          <li>Vue.js for the frontend.</li>
          <li>Node.js and Express.js for the backend API.</li>
          <li>MySQL with XAMPP for the database.</li>
        </ul>
      </section>
    </main>

    
  </div>
  <Footer />
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #ffffff;
  color: #02143a;
  font-family: Arial, sans-serif;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.card {
  padding: 2rem;
  margin-bottom: 1.5rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(5, 12, 27, 0.05);
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: #747789;
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0 0 1rem;
  color: #05051f;
  font-size: 2.4rem;
}

h2 {
  margin: 0 0 1rem;
  color: #05051f;
  font-size: 1.5rem;
}

p,
li {
  color: #747789;
  line-height: 1.7;
}

p {
  margin: 0 0 1rem;
}

p:last-child {
  margin-bottom: 0;
}

ul {
  margin: 0;
  padding-left: 1.2rem;
}

li {
  margin-bottom: 0.4rem;
}

@media (max-width: 700px) {
  .content {
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 2rem;
  }
}
</style>
