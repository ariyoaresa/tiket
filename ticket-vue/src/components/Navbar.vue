<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMobileMenuOpen = ref(false)

// Make auth state reactive
const session = ref(null)
const isLoggedIn = computed(() => !!session.value)

const readSession = () => {
  try {
    const raw = localStorage.getItem('ticketapp_session')
    session.value = raw ? JSON.parse(raw) : null
  } catch (e) {
    session.value = null
  }
}

const handleLogout = () => {
  localStorage.removeItem('ticketapp_session')
  localStorage.setItem('ticketapp_flash', 'You have been logged out.')
  readSession()
  router.push('/')
}

onMounted(() => {
  readSession()
  window.addEventListener('storage', (e) => {
    if (e.key === 'ticketapp_session') {
      readSession()
    }
  })
  window.addEventListener('ticketapp_session_updated', readSession)
})
</script>

<template>
  <nav class="bg-white shadow-md border-b">
    <div class="w-full px-4 flex items-center justify-between h-16">
      <!-- Left: Brand -->
      <div class="flex items-center gap-2">
        <router-link to="/" class="text-2xl font-bold text-blue-600">Tiket</router-link>
      </div>

      <!-- Right: Desktop Menu -->
      <div class="hidden md:flex items-center space-x-4">
        <template v-if="isLoggedIn">
          <router-link to="/dashboard" class="text-gray-700 hover:text-blue-600 px-3 py-2">Dashboard</router-link>
          <router-link to="/tickets" class="text-gray-700 hover:text-blue-600 px-3 py-2">Tickets</router-link>
          <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" @click="handleLogout">Logout</button>
        </template>
        <template v-else>
          <router-link to="/auth/login" class="text-gray-700 hover:text-blue-600 px-3 py-2">Login</router-link>
          <router-link to="/auth/signup" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Sign Up</router-link>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <div class="md:hidden">
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-gray-700 hover:text-blue-600 px-2 py-1 border rounded">
          <span v-if="!isMobileMenuOpen">Menu</span>
          <span v-else>Close</span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden py-4 border-t">
      <div class="w-full px-4">
        <template v-if="isLoggedIn">
          <div class="flex flex-col space-y-2">
            <router-link @click="isMobileMenuOpen=false" to="/dashboard" class="text-gray-700 hover:text-blue-600 px-3 py-2">Dashboard</router-link>
            <router-link @click="isMobileMenuOpen=false" to="/tickets" class="text-gray-700 hover:text-blue-600 px-3 py-2">Tickets</router-link>
            <button @click="handleLogout" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-left">Logout</button>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col space-y-2">
            <router-link @click="isMobileMenuOpen=false" to="/auth/login" class="text-gray-700 hover:text-blue-600 px-3 py-2">Login</router-link>
            <router-link @click="isMobileMenuOpen=false" to="/auth/signup" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center">Sign Up</router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>