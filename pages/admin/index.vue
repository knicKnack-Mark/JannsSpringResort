<template>
  <div>
    <h4 class="fw-bold mb-3">Dashboard</h4>

    <!-- STATS -->
    <AdminStatsCards />

    <!-- CHART -->
    <div class="mt-4">
      <AdminRevenueChart />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import AdminStatsCards from '~/components/admin/StatsCards.vue'
import AdminRevenueChart from '~/components/admin/RevenueChart.vue'

definePageMeta({
  layout: 'admin'
})

const { apiFetch } = useApi()

/* =========================
   STATE
========================= */
const bookings = ref([])

/* =========================
   FETCH BOOKINGS
========================= */
const fetchBookings = async () => {
  try {
    const res = await apiFetch('/bookings', {
      method: 'GET',
      params: {
        per_page: 1000
      }
    })

    bookings.value = res?.data || []
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchBookings)

/* =========================
   DATE HELPERS
========================= */
const parseLocal = (dt) => {
  if (!dt) return null

  const clean = dt
    .replace('T', ' ')
    .replace('Z', '')
    .split('.')[0]

  return new Date(clean)
}

const formatDate = (date) => {
  return date.toISOString().split('T')[0]
}

/* =========================
   CURRENT MONTH
========================= */
const currentMonth = '2026-04'

/* =========================
   GROUP BOOKINGS BY DATE
========================= */
const grouped = computed(() => {
  const map = {}

  bookings.value.forEach((b) => {
    const start = parseLocal(b.start_datetime)
    const end = parseLocal(b.end_datetime)

    if (!start || !end) return

    const current = new Date(start)

    while (current <= end) {
      const dateStr = formatDate(current)

      if (!dateStr.startsWith(currentMonth)) {
        current.setDate(current.getDate() + 1)
        continue
      }

      if (!map[dateStr]) map[dateStr] = []

      map[dateStr].push(b)

      current.setDate(current.getDate() + 1)
    }
  })

  return map
})

/* =========================
   FULLY BOOKED
========================= */
const bookedDays = computed(() => {
  return Object.values(grouped.value).filter((dayBookings) =>
    dayBookings.length >= 2
  ).length
})

/* =========================
   PARTIAL
========================= */
const partialDays = computed(() => {
  return Object.values(grouped.value).filter((dayBookings) =>
    dayBookings.length === 1
  ).length
})

/* =========================
   AVAILABLE
========================= */
const availableDays = computed(() => {
  const totalDays = new Date(2026, 4, 0).getDate()

  return totalDays - bookedDays.value - partialDays.value
})
</script>

<style scoped>
.summary-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #f1f1f1;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
}

.summary-label {
  font-size: 13px;
  color: #6b7280;
}
</style>