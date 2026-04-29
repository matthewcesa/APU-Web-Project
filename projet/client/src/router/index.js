import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser, isAuthenticated } from '../services/auth'

import LoginPage from '../views/LoginPage.vue'
import HomePage_Student from '../views/HomePage_Student.vue'
import HomePage_Teacher from '../views/HomePage_Teacher.vue'
import HomePage_Admin from '../views/HomePage_Admin.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/student',
    component: HomePage_Student,
    meta: {
      requiresAuth: true,
      role: 'student'
    }
  },
  {
    path: '/teacher',
    component: HomePage_Teacher,
    meta: {
      requiresAuth: true,
      role: 'teacher'
    }
  },
  {
    path: '/admin',
    component: HomePage_Admin,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login'
  }

  const user = getCurrentUser()

  if (to.meta.role && user?.role !== to.meta.role) {
    return '/login'
  }
})

export default router