<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({ name: '', email: '', password: '' })
const errors = reactive({ name: '', email: '', password: '' })
const toast = ref('')

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('ticketapp_users') || '[]')
  } catch (e) {
    return []
  }
}

const saveUsers = (users) => {
  localStorage.setItem('ticketapp_users', JSON.stringify(users))
}

const validate = () => {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  let ok = true
  if (!form.name || form.name.trim().length < 2) {
    errors.name = 'Please enter your name.'
    ok = false
  }
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
    toast.value = 'Please fix the errors and try again.'
    return
  }
  const users = getUsers()
  const exists = users.some(u => u.email.toLowerCase() === form.email.toLowerCase())
  if (exists) {
    errors.email = 'An account with this email already exists.'
    toast.value = 'Signup failed.'
    return
  }
  const newUser = { name: form.name.trim(), email: form.email.trim(), password: form.password }
  users.push(newUser)
  saveUsers(users)
  const token = 'mock_' + Math.random().toString(36).slice(2)
  const session = { token, email: newUser.email, name: newUser.name }
  localStorage.setItem('ticketapp_session', JSON.stringify(session))
  window.dispatchEvent(new Event('ticketapp_session_updated'))
  toast.value = 'Signup successful! Redirecting...'
  setTimeout(() => router.push('/dashboard'), 400)
}
</script>

<template>
  <section class="min-h-screen bg-gray-50">
    <div class="max-w-[1440px] mx-auto px-4 py-10">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow p-6">
        <h2 class="text-2xl font-bold text-gray-900">Create your account</h2>
        <p class="text-gray-600">Sign up to start managing tickets</p>

        <form class="mt-6 space-y-4" @submit="onSubmit">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input id="name" type="text" v-model="form.name" class="mt-1 w-full border rounded px-3 py-2 focus:outline-blue-600" required :aria-invalid="!!errors.name" />
            <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
          </div>

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

          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Sign up</button>
        </form>

        <p v-if="toast" class="mt-4 text-sm" :class="toast.includes('successful') ? 'text-emerald-600' : 'text-red-600'">{{ toast }}</p>

        <p class="mt-4 text-sm text-gray-600">Already have an account? <router-link class="text-blue-600" to="/auth/login">Log in</router-link></p>
      </div>
    </div>

    <footer class="border-t bg-white">
      <div class="max-w-[1440px] mx-auto px-4 py-6 text-center text-sm text-gray-600">© {{ new Date().getFullYear() }} Tiket — All rights reserved.</div>
    </footer>
  </section>
</template>