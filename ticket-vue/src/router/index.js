import { createRouter, createWebHistory } from 'vue-router'

const sessionKey = 'ticketapp_session'

const requireAuth = (to, from, next) => {
  const token = localStorage.getItem(sessionKey)
  if (!token) {
    localStorage.setItem('ticketapp_flash', 'Your session has expired — please log in again.')
    next({ path: '/auth/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
}

const routes = [
  { path: '/', name: 'Landing', component: () => import('../pages/Landing.vue') },
  { path: '/auth/login', name: 'Login', component: () => import('../pages/Login.vue') },
  { path: '/auth/signup', name: 'Signup', component: () => import('../pages/Signup.vue') },
  { path: '/dashboard', name: 'Dashboard', component: () => import('../pages/Dashboard.vue'), beforeEnter: requireAuth },
  { path: '/tickets', name: 'Tickets', component: () => import('../pages/Tickets.vue'), beforeEnter: requireAuth },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../pages/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router