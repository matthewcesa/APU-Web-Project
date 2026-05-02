<script setup>
import Header from '../components/PageHeader.vue'
import Footer from '../components/PageFooter.vue'

const storedUser = localStorage.getItem('user')
const user = storedUser ? JSON.parse(storedUser) : null

const teamMembers = [
  {
    name: 'Antoine CRAUSER',
    role: 'Frontend development',
    description: 'Worked on both backend and frontend features of the whole project',
  },
  {
    name: 'Matthew CESA',
    role: 'Backend development',
    description: 'Worked on the backend and the professors management of courses',
  },
  {
    name: 'Clément Besnard',
    role: 'Database design',
    description: 'Worked on some vues and CSS',
  },
  {
    name: 'Karl GAUDISSARD',
    role: 'Database design',
    description: 'Designed components and helped with some backend routes and functions in Models',
  },
]
</script>

<template>
  <div class="page">
    <Header :user="user" />

    <main class="content">
      <section class="card">
        <p class="eyebrow">About our team</p>
        <h1>Our project team</h1>

        <p>
          MCQoodle was developed by our team as part of our Advanced Web Development project. Each
          team member contributed to the design, development and testing of the platform.
        </p>
      </section>

      <section class="team-list">
        <article v-for="member in teamMembers" :key="member.name" class="member-card">
          <div class="avatar">
            {{ member.name.charAt(0) }}
          </div>

          <div>
            <h2>{{ member.name }}</h2>
            <strong>{{ member.role }}</strong>
            <p>{{ member.description }}</p>
          </div>
        </article>
      </section>
    </main>

    <Footer />
  </div>
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

.card,
.member-card {
  padding: 2rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(5, 12, 27, 0.05);
}

.card {
  margin-bottom: 1.5rem;
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
  margin: 0 0 0.4rem;
  color: #05051f;
  font-size: 1.2rem;
}

p {
  margin: 0;
  color: #747789;
  line-height: 1.7;
}

strong {
  display: block;
  margin-bottom: 0.6rem;
  color: #02143a;
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-card {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
}

.avatar {
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #05051f;
  color: white;
  border-radius: 16px;
  font-size: 1.3rem;
  font-weight: 900;
}

@media (max-width: 700px) {
  .content {
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .member-card {
    flex-direction: column;
  }
}
</style>
