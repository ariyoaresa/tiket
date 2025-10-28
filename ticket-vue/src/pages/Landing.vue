<template>
  <section class="min-h-screen bg-linear-to-b from-blue-50 to-white relative overflow-hidden">
    <!-- Decorative Circles -->
    <div aria-hidden="true" class="absolute top-10 left-10 w-24 h-24 bg-blue-200 rounded-full blur-sm"></div>
    <div aria-hidden="true" class="absolute bottom-20 right-20 w-32 h-32 bg-emerald-200 rounded-full blur-sm"></div>

    <!-- Wavy SVG background at bottom edge -->
    <svg class="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M0 80 C 240 140 480 20 720 80 C 960 140 1200 20 1440 80 L 1440 150 L 0 150 Z" fill="#e0f2fe" />
    </svg>

    <div class="max-w-[1440px] mx-auto px-4 py-16">
      <div class="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900">Tiket — Simple Ticket Management</h1>
          <p class="mt-4 text-lg text-gray-600">Track, organize, and resolve tickets effortlessly. Designed for teams and individuals who want clarity and speed.</p>
          <div class="mt-8 flex flex-wrap gap-4">
            <router-link to="/auth/login" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow">Login</router-link>
            <router-link to="/auth/signup" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded shadow">Get Started</router-link>
          </div>
        </div>
        <div>
          <!-- Illustration placeholder -->
          <div class="bg-white rounded-xl shadow p-6 text-gray-600">Manage your tickets with ease.</div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Why Choose Tiket?</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features designed to streamline your ticket management workflow</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="bg-white p-6 rounded-xl shadow-md border">
          <div class="mb-4">
            <span class="inline-block w-8 h-8 rounded bg-green-100"></span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Easy Ticket Creation</h3>
          <p class="text-gray-600 leading-relaxed">Create and manage tickets with a simple, intuitive interface that gets you started in seconds.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md border">
          <div class="mb-4">
            <span class="inline-block w-8 h-8 rounded bg-blue-100"></span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Real-time Tracking</h3>
          <p class="text-gray-600 leading-relaxed">Monitor ticket progress in real-time with instant updates and status notifications.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md border">
          <div class="mb-4">
            <span class="inline-block w-8 h-8 rounded bg-purple-100"></span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Team Collaboration</h3>
          <p class="text-gray-600 leading-relaxed">Work together seamlessly with your team to resolve issues faster and more efficiently.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md border">
          <div class="mb-4">
            <span class="inline-block w-8 h-8 rounded bg-orange-100"></span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Analytics Dashboard</h3>
          <p class="text-gray-600 leading-relaxed">Get insights into your ticket metrics with comprehensive analytics and reporting tools.</p>
        </div>
      </div>
    </div>

    <footer class="border-t bg-white">
      <div class="max-w-[1440px] mx-auto px-4 py-6 text-center text-sm text-gray-600">© {{ new Date().getFullYear() }} Tiket — All rights reserved.</div>
    </footer>
  </section>
</template>

<script setup>
// No cards here: feature cards moved to Dashboard page.
</script>

<style scoped>
/* Clip-path alternative for wave if needed */
</style>