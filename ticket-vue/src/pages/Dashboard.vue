<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

let session = null
try {
  session = JSON.parse(localStorage.getItem('ticketapp_session') || 'null')
} catch (e) {
  session = null
}
const userEmail = session?.email || 'anonymous'
const tickets = JSON.parse(localStorage.getItem(`ticketapp_tickets:${userEmail}`) || '[]')

const total = computed(() => tickets.length)
const open = computed(() => tickets.filter(t => t.status === 'open').length)
const resolved = computed(() => tickets.filter(t => t.status === 'closed').length)

const logout = () => {
  localStorage.removeItem('ticketapp_session')
  window.dispatchEvent(new Event('ticketapp_session_updated'))
  router.push('/')
}
</script>

<template>
  <section class="min-h-screen bg-gray-50">
    <div class="max-w-[1440px] mx-auto px-4 py-10">
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold text-gray-900">Dashboard</h2>
        <router-link to="/tickets" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Go to Tickets</router-link> 
      </div>

      <!-- Summary stats cards -->
      <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="text-gray-600">Total tickets</h3>
          <p class="text-4xl font-bold text-gray-900">{{ total }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="text-gray-600">Open tickets</h3>
          <p class="text-4xl font-bold text-emerald-700">{{ open }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="text-gray-600">Resolved tickets</h3>
          <p class="text-4xl font-bold text-gray-700">{{ resolved }}</p>
        </div>
      </div>

      <!-- Feature cards section (moved from Landing) -->
      <div class="mt-10 grid md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow p-6">
          <h4 class="text-lg font-semibold text-gray-900">Create & manage</h4>
          <p class="mt-2 text-gray-600">Quickly create tickets and update their status as work progresses.</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <h4 class="text-lg font-semibold text-gray-900">Track progress</h4>
          <p class="mt-2 text-gray-600">Use dashboards to monitor open and resolved items.</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <h4 class="text-lg font-semibold text-gray-900">Collaborate</h4>
          <p class="mt-2 text-gray-600">Work with your team by sharing insights and updates.</p>
        </div>
      </div>
    </div>

    <footer class="border-t bg-white">
      <div class="max-w-[1440px] mx-auto px-4 py-6 text-center text-sm text-gray-600">© {{ new Date().getFullYear() }} Tiket — All rights reserved.</div>
    </footer>
  </section>
</template>