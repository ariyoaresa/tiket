<script setup>
import Navbar from './components/Navbar.vue'
import { ref, onMounted } from 'vue'

const flash = ref('')

onMounted(() => {
  const msg = localStorage.getItem('ticketapp_flash')
  if (msg) {
    flash.value = msg
    localStorage.removeItem('ticketapp_flash')
    setTimeout(() => { flash.value = '' }, 3000)
  }
})
</script>

<template>
  <div id="app">
    <Navbar />
    <main role="main">
      <router-view />
    </main>

    <!-- Toast / Snackbar -->
    <div v-if="flash" class="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded shadow-lg" role="status" aria-live="polite">{{ flash }}</div>
  </div>
</template>

<style scoped>
main {
  width: 100%;
}
</style>
