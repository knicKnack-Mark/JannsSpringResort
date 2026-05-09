<template>
  <div>
    <h4 class="mb-3 fw-bold">Inventory</h4>

    <!-- FILTERS -->
    <div class="d-flex align-items-center gap-2 mb-3">
      <input
        v-model="search"
        type="text"
        class="form-control"
        style="width: 250px; height: 42px;"
        placeholder="Search name, address..."
        @input="handleSearch"
      />

      <select
        v-model="status"
        class="form-select"
        style="width: 180px; height: 42px;"
        @change="fetchBookings(1)"
      >
        <option value="">All</option>
        <option value="paid">Fully Paid</option>
        <option value="unpaid">Unpaid</option>
      </select>

      <button
        class="btn btn-primary ms-auto"
        style="height: 42px;"
        @click="openAdd"
      >
        + Add Booking
      </button>
    </div>

    <!-- TABLE -->
    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Cabin</th>
              <th>Schedule</th>
              <th>Guests</th>
              <th>Videoke</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Balance</th>
              <th>Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="10" class="text-center py-4">
                <div class="spinner-border text-primary"></div>
              </td>
            </tr>

            <tr
              v-else-if="inventory.length > 0"
              v-for="item in inventory"
              :key="item.id"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.address }}</td>
              <td class="fw-semibold text-muted">{{ item.cabin }}</td>

              <td>
                <div class="d-flex flex-column" style="font-size: 13px;">
                  <div class="fw-semibold">
                    {{ formatFullDate(item.start_datetime) }}
                    <span v-if="isOvernight(item)">
                      → {{ formatFullDate(item.end_datetime) }}
                    </span>
                  </div>
                  <div class="text-muted" style="font-size: 12px;">
                    {{ formatTime(item.start_datetime) }}
                    →
                    {{ formatTime(item.end_datetime) }}
                  </div>
                </div>
              </td>

              <td>{{ item.guests }}</td>

              <td>
                <span
                  class="badge"
                  :class="item.videoke ? 'bg-success' : 'bg-secondary'"
                >
                  {{ item.videoke ? "Yes" : "No" }}
                </span>
              </td>

              <td class="fw-bold text-success">
                ₱{{ formatMoney(item.amount) }}
              </td>

              <td>
                <span class="badge" :class="getPaymentStatusClass(item)">
                  {{ getPaymentStatus(item) }}
                </span>
              </td>

              <td>
                <span
                  :class="getBalance(item) === 0 ? 'text-success' : 'text-danger'"
                >
                  ₱{{ formatMoney(getBalance(item)) }}
                </span>
              </td>

              <td>
                <span
                  class="badge"
                  :class="getStatusClass(item)"
                >
                  {{ getStatusLabel(item) }}
                </span>
              </td>

              <td class="text-center">
                <div class="d-flex justify-content-center gap-2">

                  <button
                    class="btn btn-light border"
                    @click="editItem(item)"
                  >
                    <Icon name="mdi:pencil" size="18" />
                  </button>

                  <button
                    class="btn btn-light border text-danger"
                    @click="openDelete(item)"
                  >
                    <Icon name="mdi:delete" size="18" />
                  </button>

                  <button
                    class="btn btn-light border text-warning"
                    @click="addPayment(item)"
                  >
                    <Icon name="mdi:cash-plus" size="18" />
                  </button>

                </div>
              </td>
            </tr>

            <tr v-else>
              <td colspan="10" class="text-center py-3">
                No records found.
              </td>
            </tr>
          </tbody>
        </table>

        <!-- PAGINATION -->
        <div class="d-flex justify-content-between align-items-center p-3">
          <div class="text-muted small">
            Page {{ currentPage }} of {{ lastPage }}
          </div>

          <div class="btn-group">
            <button
              class="btn btn-sm btn-outline-secondary"
              :disabled="currentPage === 1"
              @click="fetchBookings(currentPage - 1)"
            >
              Prev
            </button>

            <button
              v-for="page in lastPage"
              :key="page"
              class="btn btn-sm"
              :class="page === currentPage ? 'btn-primary' : 'btn-outline-secondary'"
              @click="fetchBookings(page)"
            >
              {{ page }}
            </button>

            <button
              class="btn btn-sm btn-outline-secondary"
              :disabled="currentPage === lastPage"
              @click="fetchBookings(currentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <AddBookingModal :editData="selectedItem" @save="handleSave" />
    <PaymentModal :item="selectedPaymentItem" @confirm="handlePaymentConfirm" />
    <DeleteModal :item="selectedDeleteItem" @confirm="handleDeleteConfirm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import AddBookingModal from '@/components/admin/AddBookingModal.vue'
import PaymentModal from '@/components/admin/PaymentModal.vue'
import DeleteModal from '@/components/admin/DeleteModal.vue'

import { useToast } from 'vue-toastification'
import { useModal } from '@/composables/useModal'

definePageMeta({
  layout: 'admin'
})

const toast = useToast()

const { open, close } = useModal()

const config = useRuntimeConfig()

/* IMPORTANT */
const API_URL =
  config.public.API_URL ||
  'http://127.0.0.1:8000/api'

const token = useCookie('token')

/* AXIOS */
const api = axios.create({
  baseURL: API_URL,

  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

/* REQUEST INTERCEPTOR */
api.interceptors.request.use((request) => {

  if (token.value) {

    request.headers.Authorization =
      `Bearer ${token.value}`
  }

  return request
})

/* RESPONSE INTERCEPTOR */
api.interceptors.response.use(

  response => response,

  error => {

    /* AUTO LOGOUT */
    if (error.response?.status === 401) {

      token.value = null

      useCookie('user').value = null

      navigateTo('/admin/login')
    }

    return Promise.reject(error)
  }
)

/* STATE */
const inventory = ref([])

const currentPage = ref(1)

const lastPage = ref(1)

const loading = ref(false)

const selectedItem = ref(null)

const selectedPaymentItem = ref(null)

const selectedDeleteItem = ref(null)

const search = ref('')

const status = ref('')

let debounceTimeout = null

/* FETCH BOOKINGS */
const fetchBookings = async (page = 1) => {

  loading.value = true

  try {

    const res = await api.get('/bookings', {

      params: {
        page,
        search: search.value,
        status: status.value
      }
    })

    inventory.value =
      res.data.data || []

    currentPage.value =
      res.data.current_page || 1

    lastPage.value =
      res.data.last_page || 1

  } catch (err) {

    console.error(err)

    /* BACKEND MESSAGE */
    toast.error(

      err.response?.data?.message ||

      err.response?.data?.error ||

      err.message ||

      'Something went wrong'
    )

  } finally {

    loading.value = false
  }
}

onMounted(() => {

  fetchBookings()
})

/* SEARCH */
const handleSearch = () => {

  clearTimeout(debounceTimeout)

  debounceTimeout = setTimeout(() => {

    fetchBookings(1)

  }, 400)
}

/* PARSE LOCAL DATETIME */
const parseLocal = (dt) => {

  if (!dt) return null

  let clean =
    dt.replace('T', ' ')

  if (clean.includes('.')) {

    clean =
      clean.split('.')[0]
  }

  clean =
    clean.replace('Z', '')

  const [
    datePart,
    timePart
  ] = clean.split(' ')

  if (
    !datePart ||
    !timePart
  ) {
    return null
  }

  const [
    year,
    month,
    day
  ] = datePart
    .split('-')
    .map(Number)

  const [
    hour,
    minute,
    second
  ] = timePart
    .split(':')
    .map(Number)

  return new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second || 0
  )
}

/* FORMAT DATE */
const formatFullDate = (dt) => {

  const d =
    parseLocal(dt)

  if (!d) return ''

  return d.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
  )
}

/* FORMAT TIME */
const formatTime = (dt) => {

  const d =
    parseLocal(dt)

  if (!d) return ''

  return d.toLocaleTimeString(
    [],
    {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }
  )
}

/* OVERNIGHT */
const isOvernight = (item) => {

  const start =
    parseLocal(
      item.start_datetime
    )

  const end =
    parseLocal(
      item.end_datetime
    )

  return (
    start &&
    end &&
    start.toDateString() !==
    end.toDateString()
  )
}

/* HELPERS */
const formatMoney = (value) => {

  return Number(
    value || 0
  ).toLocaleString()
}

const getBalance = (item) => {

  return (
    (item.amount || 0) -
    (item.paid || 0)
  )
}

const getPaymentStatus = (item) => {

  return (
    (item.paid || 0) >=
    (item.amount || 0)
  )
    ? 'Fully Paid'
    : 'Partially Paid'
}

const getPaymentStatusClass = (item) => {

  return (
    (item.paid || 0) >=
    (item.amount || 0)
  )
    ? 'bg-success'
    : 'bg-warning text-dark'
}

const getStatusLabel = (item) => {

  return item.status === 'cancelled'
    ? 'Cancelled'
    : 'Confirmed'
}

const getStatusClass = (item) => {

  return item.status === 'cancelled'
    ? 'bg-danger-subtle text-danger'
    : 'bg-success-subtle text-success'
}

/* OPEN ADD */
const openAdd = () => {

  selectedItem.value = null

  open('addBookingModal')
}

/* EDIT */
const editItem = (item) => {

  selectedItem.value = {
    ...item
  }

  open('addBookingModal')
}

/* PAYMENT */
const addPayment = (item) => {

  selectedPaymentItem.value =
    item

  open('paymentModal')
}

/* CONFIRM PAYMENT */
const handlePaymentConfirm =
async (amount) => {

  try {

    await api.post(
      `/bookings/${selectedPaymentItem.value.id}/payment`,
      { amount }
    )

    toast.success(
      'Payment added'
    )

    fetchBookings(
      currentPage.value
    )

  } catch (err) {

    console.error(err)

    toast.error(

      err.response?.data?.message ||

      err.response?.data?.error ||

      err.message ||

      'Payment failed'
    )
  }
}

/* TO SERVER DATETIME */
const toServerDateTime = (dt) => {

  if (!dt) return null

  return (
    dt.getFullYear() +
    '-' +
    String(dt.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(dt.getDate()).padStart(2, '0') +
    ' ' +
    String(dt.getHours()).padStart(2, '0') +
    ':' +
    String(dt.getMinutes()).padStart(2, '0') +
    ':00'
  )
}

/* SAVE */
const handleSave = async (data) => {

  const payload = {

    ...data,

    start_datetime:
      toServerDateTime(
        data.start_datetime
      ),

    end_datetime:
      toServerDateTime(
        data.end_datetime
      ),

    paid:
      data.paid ?? 0,

    status:
      data.status ??
      'confirmed'
  }

  try {

    if (selectedItem.value) {

      await api.put(
        `/bookings/${selectedItem.value.id}`,
        payload
      )

      toast.success(
        'Booking updated'
      )

    } else {

      await api.post(
        '/bookings',
        payload
      )

      toast.success(
        'Booking created'
      )
    }

    fetchBookings(
      currentPage.value
    )

  } catch (err) {

    console.error(err)

    toast.error(

      err.response?.data?.message ||

      err.response?.data?.error ||

      err.message ||

      'Booking failed'
    )
  }
}

/* DELETE */
const openDelete = (item) => {

  selectedDeleteItem.value =
    item

  open('deleteModal')
}

const handleDeleteConfirm =
async (item) => {

  try {

    await api.delete(
      `/bookings/${item.id}`
    )

    toast.success(
      'Booking deleted'
    )

    close('deleteModal')

    fetchBookings(
      currentPage.value
    )

  } catch (err) {

    console.error(err)

    toast.error(

      err.response?.data?.message ||

      err.response?.data?.error ||

      err.message ||

      'Delete failed'
    )
  }
}
</script>

<style scoped>
.card {
  border-radius: 12px;
}

table th,
table td {
  vertical-align: middle;
}
</style>