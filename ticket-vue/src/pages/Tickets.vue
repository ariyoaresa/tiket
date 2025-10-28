<script setup>
import { reactive, ref, computed } from 'vue'

const SESSION_KEY = 'ticketapp_session'
let session = null
try {
  session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
} catch (e) {
  session = null
}
const userEmail = session?.email || 'anonymous'
const STORAGE_KEY = `ticketapp_tickets:${userEmail}`
const STATUS_VALUES = ['open', 'in_progress', 'closed']

const toast = ref('')
const confirmId = ref(null)
const showForm = ref(false)

const list = ref([])

const load = () => {
  try {
    list.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch (e) {
    toast.value = 'Failed to load tickets. Please retry.'
  }
}

const save = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.value))
}

load()

const form = reactive({ id: null, title: '', status: 'open', description: '', priority: '' })
const errors = reactive({ title: '', status: '', description: '', priority: '' })

const resetForm = () => {
  form.id = null
  form.title = ''
  form.status = 'open'
  form.description = ''
  form.priority = ''
  errors.title = ''
  errors.status = ''
  errors.description = ''
  errors.priority = ''
}

const validate = () => {
  errors.title = ''
  errors.status = ''
  errors.description = ''
  errors.priority = ''
  let ok = true
  if (!form.title.trim()) { errors.title = 'Title is required.'; ok = false }
  if (!STATUS_VALUES.includes(form.status)) { errors.status = 'Status must be open, in_progress, or closed.'; ok = false }
  if (form.description && form.description.length > 500) { errors.description = 'Description must be 500 characters or less.'; ok = false }
  if (form.priority && !['low','medium','high'].includes(form.priority)) { errors.priority = 'Priority must be low, medium, or high.'; ok = false }
  return ok
}

const statusClass = (s) => ({
  open: 'bg-emerald-100 text-emerald-800',
  in_progress: 'bg-amber-100 text-amber-800',
  closed: 'bg-gray-200 text-gray-700'
}[s] || 'bg-gray-100 text-gray-700')

const submit = (e) => {
  e.preventDefault()
  if (!validate()) { toast.value = 'Please fix validation errors.'; return }
  if (form.id == null) {
    const newTicket = { id: Date.now(), title: form.title.trim(), status: form.status, description: form.description, priority: form.priority }
    list.value.unshift(newTicket)
    toast.value = 'Ticket created successfully.'
  } else {
    const idx = list.value.findIndex(t => t.id === form.id)
    if (idx !== -1) {
      list.value[idx] = { id: form.id, title: form.title.trim(), status: form.status, description: form.description, priority: form.priority }
      toast.value = 'Ticket updated successfully.'
    }
  }
  save()
  resetForm()
  showForm.value = false
}

const editTicket = (t) => {
  form.id = t.id
  form.title = t.title
  form.status = t.status
  form.description = t.description || ''
  form.priority = t.priority || ''
  showForm.value = true
}

const requestDelete = (id) => { confirmId.value = id }
const cancelDelete = () => { confirmId.value = null }
const confirmDelete = () => {
  const idx = list.value.findIndex(t => t.id === confirmId.value)
  if (idx !== -1) { list.value.splice(idx,1); toast.value = 'Ticket deleted.'; save() }
  confirmId.value = null
}

const totals = computed(() => ({
  total: list.value.length,
  open: list.value.filter(t => t.status === 'open').length,
  in_progress: list.value.filter(t => t.status === 'in_progress').length,
  closed: list.value.filter(t => t.status === 'closed').length,
}))
const startCreate = () => { resetForm(); showForm.value = true }
const cancelForm = () => { resetForm(); showForm.value = false }
</script>

<template>
  <section class="min-h-screen bg-gray-50">
    <div class="max-w-[1440px] mx-auto px-4 py-10">
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold text-gray-900">Tickets</h2>
        <router-link to="/dashboard" class="text-blue-600">Back to Dashboard</router-link>
      </div>

      <!-- Stats cards -->
      <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow p-6">
          <h4 class="text-gray-600">Total</h4>
          <p class="text-2xl font-bold">{{ totals.total }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <h4 class="text-gray-600">Open</h4>
          <p class="text-2xl font-bold text-emerald-700">{{ totals.open }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <h4 class="text-gray-600">In Progress</h4>
          <p class="text-2xl font-bold text-amber-700">{{ totals.in_progress }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <h4 class="text-gray-600">Closed</h4>
          <p class="text-2xl font-bold text-gray-700">{{ totals.closed }}</p>
        </div>
      </div>

      <!-- Create Ticket CTA -->
      <div class="mt-8 flex justify-end">
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" @click="startCreate">Create Ticket</button>
      </div>
      <!-- Form: hidden until creating/editing -->
      <div v-if="showForm" class="mt-4 bg-white rounded-xl shadow p-6">
        <h3 class="text-xl font-semibold text-gray-900">{{ form.id ? 'Edit Ticket' : 'Create Ticket' }}</h3>
        <form class="mt-4 grid md:grid-cols-2 gap-4" @submit="submit">
          <div class="md:col-span-1">
            <label for="title" class="block text-sm font-medium text-gray-700">Title<span class="text-red-600">*</span></label>
            <input id="title" type="text" v-model="form.title" class="mt-1 w-full border rounded px-3 py-2 focus:outline-blue-600" />
            <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
          </div>
          <div class="md:col-span-1">
            <label for="status" class="block text-sm font-medium text-gray-700">Status<span class="text-red-600">*</span></label>
            <select id="status" v-model="form.status" class="mt-1 w-full border rounded px-3 py-2 focus:outline-blue-600">
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <p v-if="errors.status" class="text-red-600 text-sm mt-1">{{ errors.status }}</p>
          </div>
          <div class="md:col-span-2">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" rows="3" v-model="form.description" class="mt-1 w-full border rounded px-3 py-2 focus:outline-blue-600"></textarea>
            <p v-if="errors.description" class="text-red-600 text-sm mt-1">{{ errors.description }}</p>
          </div>
          <div class="md:col-span-1">
            <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
            <select id="priority" v-model="form.priority" class="mt-1 w-full border rounded px-3 py-2 focus:outline-blue-600">
              <option value="">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <p v-if="errors.priority" class="text-red-600 text-sm mt-1">{{ errors.priority }}</p>
          </div>

          <div class="md:col-span-2 flex gap-3">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{{ form.id ? 'Update' : 'Create' }}</button>
            <button type="button" class="border px-4 py-2 rounded" @click="cancelForm">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Tickets list -->
      <div class="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="t in list" :key="t.id" class="bg-white rounded-xl shadow p-6">
          <div class="flex items-start justify-between">
            <h4 class="text-lg font-semibold text-gray-900">{{ t.title }}</h4>
            <span class="text-xs px-2 py-1 rounded" :class="statusClass(t.status)">{{ t.status.replace('_',' ') }}</span>
          </div>
          <p class="mt-2 text-gray-700">{{ t.description }}</p>
          <p v-if="t.priority" class="mt-1 text-sm text-gray-500">Priority: {{ t.priority }}</p>

          <div class="mt-4 flex gap-3">
            <button class="border px-3 py-1 rounded" @click="editTicket(t)">Edit</button>
            <button class="border border-red-600 text-red-600 px-3 py-1 rounded" @click="requestDelete(t.id)">Delete</button>
          </div>
        </div>
      </div>

      <!-- Delete confirmation -->
      <div v-if="confirmId" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow p-6 max-w-md w-full">
          <h4 class="text-lg font-semibold text-gray-900">Confirm deletion</h4>
          <p class="mt-2 text-gray-700">Are you sure you want to delete this ticket?</p>
          <div class="mt-4 flex gap-3">
            <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" @click="confirmDelete">Delete</button>
            <button class="border px-4 py-2 rounded" @click="cancelDelete">Cancel</button>
          </div>
        </div>
      </div>

      <p v-if="toast" class="mt-4 text-sm" :class="toast.includes('success') || toast.includes('created') || toast.includes('updated') ? 'text-emerald-600' : 'text-red-600'">{{ toast }}</p>
    </div>

    <footer class="border-t bg-white">
      <div class="max-w-[1440px] mx-auto px-4 py-6 text-center text-sm text-gray-600">© {{ new Date().getFullYear() }} Tiket — All rights reserved.</div>
    </footer>
  </section>
</template>