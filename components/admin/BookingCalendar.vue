<template>
  <div class="card p-3">
    <h6 class="mb-3">Booking Calendar</h6>

    <!-- DYNAMIC ROOM SELECT -->
    <select v-model="selectedCabin" class="form-select mb-3 w-auto">
      <option disabled value="">Select Room</option>
      <option 
        v-for="room in rooms" 
        :key="room.id" 
        :value="room.name"
      >
        {{ room.name }}
      </option>
    </select>

    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const props = defineProps({
  bookings: {
    type: Array,
    default: () => []
  }
})

/* =========================
   ROOMS (NEW)
========================= */
const rooms = ref([])
const selectedCabin = ref('')

const fetchRooms = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/rooms')
    const data = await res.json()

    rooms.value = data

    // auto select first room
    if (data.length > 0) {
      selectedCabin.value = data[0].name
    }
  } catch (err) {
    console.error('Failed to fetch rooms:', err)
  }
}

onMounted(fetchRooms)

/* =========================
   TIME FIX
========================= */
const parseLocal = (dt) => {
  if (!dt) return null
  return new Date(dt.replace("T", " ").replace("Z", "").split(".")[0])
}

const formatTime = (dt) => {
  const d = parseLocal(dt)
  if (!d) return ''
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/* =========================
   STATUS
========================= */
const getStatus = (b) => {
  const status = b.status?.toLowerCase()

  if (status === 'cancelled' || status === 'canceled') return 'cancelled'
  if (b.paid >= b.amount) return 'paid'
  if (b.paid > 0) return 'partial'
  return 'reserved'
}

/* =========================
   COLOR
========================= */
const getColor = (status) => {
  return {
    paid: '#10b981',
    partial: '#f59e0b',
    reserved: '#3b82f6',
    cancelled: '#fecaca'
  }[status]
}

/* =========================
   EVENTS
========================= */
const events = computed(() => {
  return (props.bookings || [])
    .filter(b =>
      (b.cabin || '').toLowerCase() === selectedCabin.value.toLowerCase()
    )
    .map(b => {
      const status = getStatus(b)

      return {
        id: b.id,

        start: parseLocal(b.start_datetime),
        end: parseLocal(b.end_datetime),

        display: 'block',

        backgroundColor: getColor(status),
        borderColor: getColor(status),

        extendedProps: {
          ...b,
          status,
          startTime: formatTime(b.start_datetime),
          endTime: formatTime(b.end_datetime)
        }
      }
    })
})

/* =========================
   CALENDAR OPTIONS
========================= */
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  height: 'auto',

  timeZone: 'local',

  events: events.value,

  dayMaxEvents: true,

  eventContent(info) {
    const b = info.event.extendedProps

    return {
      html: `
        <div class="event-clean ${b.status}">
          
          <div class="event-name">
            ${b.name}
          </div>

          <div class="event-time">
            ${b.startTime} → ${b.endTime}
          </div>

          ${
            b.status === 'cancelled'
              ? `<div class="event-status">Cancelled</div>`
              : ''
          }

        </div>
      `
    }
  }
}))
</script>

<style scoped>
.fc {
  font-size: 13px;
}

.event-clean {
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 11px;
  line-height: 1.2;
  transition: 0.2s;
}

.event-name {
  font-weight: 600;
}

.event-time {
  font-size: 10px;
  opacity: 0.9;
}

.event-status {
  font-size: 9px;
}

.event-clean.paid {
  color: white;
}

.event-clean.partial {
  color: #1f2937;
}

.event-clean.reserved {
  color: white;
}

.event-clean.cancelled {
  color: #991b1b;
  border: 1px solid #fecaca;
}

.event-clean.cancelled .event-name {
  text-decoration: line-through;
}

.fc-event:hover {
  transform: scale(1.02);
}
</style>