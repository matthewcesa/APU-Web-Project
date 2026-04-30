import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '../views/LandingPage.vue'
import LoginPage from '../views/LoginPage.vue'
import HomePage_Student from '../views/HomePage_Student.vue'
import HomePage_Teacher from '../views/HomePage_Teacher.vue'
import HomePage_Admin from '../views/HomePage_Admin.vue'
import CoursePage from '../views/CoursePage.vue'
import QuizPage from '../views/QuizPage.vue'

function getCurrentUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/student',
      name: 'student',
      component: HomePage_Student,
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: HomePage_Teacher,
      meta: { requiresAuth: true, role: 'teacher' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: HomePage_Admin,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
  path: '/courses/:id',
  name: 'course-detail',
  component: CoursePage,
  meta: { requiresAuth: true, role: 'student' },
  },
  {
  path: '/quizzes/:id',
  name: 'quiz-detail',
  component: QuizPage,
  meta: { requiresAuth: true, role: 'student' },
  }
  ]
})

router.beforeEach((to) => {
  const user = getCurrentUser()

  if (to.meta.requiresAuth && !user) {
    return '/login'
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    return '/login'
  }
})

export default router