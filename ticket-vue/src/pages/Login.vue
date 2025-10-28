<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const toast = ref('')

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('ticketapp_users') || '[]')
  } catch (e) {
    return []
  }
}

const validate = () => {
  errors.email = ''
  errors.password = ''
  let ok = true
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email.'
    ok = false
  }
  if (!form.password || form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
    ok = false
  }
  return ok
}

const onSubmit = (e) => {
  e.preventDefault()
  toast.value = ''
  if (!validate()) {
    toast.value = 'Invalid credentials. Please check your inputs.'
    return
  }
  const users = getUsers()
  const user = users.find(u => u.email.toLowerCase() === form.email.toLowerCase())
  if (!user || user.password !== form.password) {
    toast.value = 'Invalid email or password.'
    return
  }
  const token = 'mock_' + Math.random().toString(36).slice(2)
  const session = { token, email: user.email, name: user.name }
  localStorage.setItem('ticketapp_session', JSON.stringify(session))
  window.dispatchEvent(new Event('ticketapp_session_updated'))
  toast.value = 'Login successful! Redirecting...'
  const redirect = route.query.redirect || '/dashboard'
  setTimeout(() => router.push(redirect), 400)
}
</script>

<template>
  <section class="min-h-screen bg-gray-50">
    <div class="max-w-[1440px] mx-auto px-4 py-10">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow p-6">
        <h2 class="text-2xl font-bold text-gray-900">Login</h2>
        <p class="text-gray-600">Access your dashboard</p>

        <form class="mt-6 space-y-4" @submit="onSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" v-model="form.email" class="mt-1 w-full border rounded px-3 py-2 focus:outline-blue-600" required :aria-invalid="!!errors.email" />
            <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" v-model="form.password" class="mt-1 w-full border rounded px-3 py-2 focus:outline-blue-600" required :aria-invalid="!!errors.password" />
            <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Login</button>
        </form>

        <p v-if="toast" class="mt-4 text-sm" :class="toast.includes('successful') ? 'text-emerald-600' : 'text-red-600'">{{ toast }}</p>

        <p class="mt-4 text-sm text-gray-600">Don’t have an account? <router-link class="text-blue-600" to="/auth/signup">Sign up</router-link></p>
      </div>
    </div>

    <footer class="border-t bg-white">
      <div class="max-w-[1440px] mx-auto px-4 py-6 text-center text-sm text-gray-600">© {{ new Date().getFullYear() }} Tiket — All rights reserved.</div>
    </footer>
  </section>
</template>