<template>
  <BaseModal id="addBookingModal" size="modal-md">

    <!-- TITLE -->
    <template #title>
      <span class="fw-semibold d-flex align-items-center gap-2">
        <Icon name="mdi:clipboard-plus" />
        {{ editData ? "Edit Booking" : "Add Booking" }}
      </span>
    </template>

    <!-- BODY -->
    <div>

      <!-- GUEST INFO -->
      <h6 class="text-muted mb-2 fw-semibold small">
        Guest Information
      </h6>

      <div class="row g-2 mb-3">

        <!-- NAME -->
        <div class="col-md-6">

          <label class="form-label">
            Name
          </label>

          <input
            v-model="form.name"
            type="text"
            class="form-control form-control-sm"
          />

        </div>

        <!-- ADDRESS -->
        <div class="col-md-6">

          <label class="form-label">
            Address
          </label>

          <input
            v-model="form.address"
            type="text"
            class="form-control form-control-sm"
          />

        </div>

      </div>

      <!-- BOOKING -->
      <h6 class="text-muted mb-2 fw-semibold small">
        Booking Details
      </h6>

      <div class="row g-2 mb-3">

        <!-- ROOM -->
        <div class="col-md-6">

          <label class="form-label">
            Cabin
          </label>

          <select
            v-model="form.room_id"
            class="form-select form-select-sm"
          >

            <option
              v-for="room in rooms"
              :key="room.id"
              :value="room.id"
            >
              {{ room.name }}
              - ₱{{ Number(room.price).toLocaleString() }}
            </option>

          </select>

        </div>

        <!-- DATE -->
        <div class="col-md-6">

          <label class="form-label">
            Date
          </label>

          <input
            v-model="form.date"
            type="date"
            class="form-control form-control-sm"
          />

        </div>

        <!-- SCHEDULE -->
        <div class="col-md-6">

          <label class="form-label">
            Schedule
          </label>

          <select
            v-model="form.schedule_id"
            class="form-select form-select-sm"
          >

            <option
              v-for="schedule in schedules"
              :key="schedule.id"
              :value="schedule.id"
            >
              {{ formatTime(schedule.start_time) }}
              -
              {{ formatTime(schedule.end_time) }}
            </option>

          </select>

        </div>

        <!-- GUESTS -->
        <div class="col-md-6">

          <label class="form-label">
            Guests
          </label>

          <input
            v-model="form.guests"
            type="number"
            class="form-control form-control-sm"
          />

        </div>

        <!-- MAX PAX -->
        <div class="col-md-4">

          <label class="form-label">
            Max Pax
          </label>

          <input
            :value="selectedRoom?.max_pax || 0"
            type="text"
            class="form-control form-control-sm"
            readonly
          />

        </div>

        <!-- EXTRA PAX RATE -->
        <div class="col-md-4">

          <label class="form-label">
            Extra Pax Rate
          </label>

          <input
            v-model="form.extra_pax_rate"
            type="number"
            class="form-control form-control-sm"
          />

        </div>

        <!-- DISCOUNT -->
        <div class="col-md-4">

          <label class="form-label">
            Discount
          </label>

          <input
            v-model="form.extra_pax_discount"
            type="number"
            class="form-control form-control-sm"
          />

        </div>

        <!-- VIDEOKE -->
        <div class="col-md-6">

          <label class="form-label">
            Videoke
          </label>

          <select
            v-model="form.videoke"
            class="form-select form-select-sm"
          >

            <option :value="true">
              Yes
            </option>

            <option :value="false">
              No
            </option>

          </select>

        </div>

        <!-- PAID -->
        <div class="col-md-6">

          <label class="form-label">
            Paid
          </label>

          <input
            v-model="form.paid"
            type="number"
            class="form-control form-control-sm"
          />

        </div>

      </div>

      <!-- AMOUNT -->
      <div class="amount-box p-2 rounded-3 small mb-2">

        <!-- ROOM -->
        <div class="d-flex justify-content-between">

          <span>
            Cabin
          </span>

          <span>
            ₱{{
              selectedRoom
                ? Number(selectedRoom.price).toLocaleString()
                : 0
            }}
          </span>

        </div>

        <!-- VIDEOKE -->
        <div
          v-if="form.videoke"
          class="d-flex justify-content-between"
        >

          <span>
            Videoke
          </span>

          <span>
            + ₱500
          </span>

        </div>

        <!-- WEEKEND -->
        <div
          v-if="form.date && (isWeekend(form.date) || isHoliday(form.date))"
          class="d-flex justify-content-between text-warning"
        >

          <span>
            Weekend / Holiday
          </span>

          <span>
            + ₱500
          </span>

        </div>

        <!-- EXTRA PAX -->
        <div
          v-if="extraPax > 0"
          class="d-flex justify-content-between text-danger"
        >

          <span>
            Extra Pax
            ({{ extraPax }} × ₱{{ form.extra_pax_rate }})
          </span>

          <span>
            + ₱{{ extraPaxTotal.toLocaleString() }}
          </span>

        </div>

        <!-- DISCOUNT -->
        <div
          v-if="form.extra_pax_discount > 0"
          class="d-flex justify-content-between text-success"
        >

          <span>
            Discount
          </span>

          <span>
            - ₱{{ Number(form.extra_pax_discount).toLocaleString() }}
          </span>

        </div>

        <hr class="my-2" />

        <!-- TOTAL -->
        <div class="d-flex justify-content-between fw-semibold text-success">

          <span>
            Total
          </span>

          <span>
            ₱{{ totalAmount.toLocaleString() }}
          </span>

        </div>

      </div>

    </div>

    <!-- FOOTER -->
    <template #footer>

      <button
        class="btn btn-light btn-sm px-3"
        @click="closeModal"
      >
        Cancel
      </button>

      <button
        class="btn btn-primary btn-sm px-3 d-flex align-items-center gap-1"
        :disabled="loading"
        @click="submit"
      >

        <span
          v-if="loading"
          class="spinner-border spinner-border-sm"
        ></span>

        <Icon name="mdi:content-save" />

        Save

      </button>

    </template>

  </BaseModal>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted
} from 'vue'

import axios from 'axios'

import BaseModal from '@/components/ui/BaseModal.vue'
import { useModal } from '@/composables/useModal'

const props = defineProps({
  editData: Object
})

const emit = defineEmits([
  'save'
])

const { close } = useModal()

const loading = ref(false)

const config = useRuntimeConfig()

/* ROOMS */
const rooms = ref([])

/* SCHEDULES */
const schedules = ref([])

/* FORM */
const form = ref({
  name: '',
  address: '',
  cabin: '',
  room_id: null,
  schedule_id: null,
  date: '',
  guests: 1,

  // EXTRA PAX
  extra_pax_rate: 100,
  extra_pax_discount: 0,

  videoke: false,
  paid: 0
})

/* FETCH ROOMS */
const fetchRooms = async () => {

  try {

    const API = config.public.apiBase

    const res = await axios.get(`${API}/rooms`)

    rooms.value = res.data

    if (rooms.value.length > 0) {

      form.value.room_id = rooms.value[0].id
      form.value.cabin = rooms.value[0].name
    }

  } catch (err) {

    console.error('Failed to fetch rooms:', err)
  }
}

/* FETCH SCHEDULES */
const fetchSchedules = async () => {

  try {

    const API = config.public.apiBase

    const res = await axios.get(`${API}/schedules`)

    schedules.value = res.data.data

    if (schedules.value.length > 0) {

      form.value.schedule_id = schedules.value[0].id
    }

  } catch (err) {

    console.error('Failed to fetch schedules:', err)
  }
}

onMounted(() => {

  fetchRooms()
  fetchSchedules()
})

/* ROOM CHANGE */
watch(
  () => form.value.room_id,
  (id) => {

    const room = rooms.value.find(
      r => r.id === id
    )

    if (room) {
      form.value.cabin = room.name
    }
  }
)

/* EDIT MODE */
watch(
  () => props.editData,
  (val) => {

    if (!val) return

    const start = new Date(val.start_datetime)

    form.value = {
      ...form.value,

      name: val.name,
      address: val.address,

      cabin: val.cabin,

      room_id: val.room_id,

      schedule_id: val.schedule_id,

      guests: val.guests,

      extra_pax_rate:
        val.extra_pax_rate || 100,

      extra_pax_discount:
        val.extra_pax_discount || 0,

      videoke: val.videoke,

      paid: val.paid || 0,

      date: start.toISOString().split('T')[0]
    }
  },
  { immediate: true }
)

/* WEEKEND */
const isWeekend = (date) => {

  const d = new Date(date)

  return (
    d.getDay() === 0 ||
    d.getDay() === 6
  )
}

/* HOLIDAYS */
const holidays = [
  '2026-01-01',
  '2026-04-09',
  '2026-06-12',
  '2026-12-25'
]

const isHoliday = (date) => {
  return holidays.includes(date)
}

/* SELECTED ROOM */
const selectedRoom = computed(() => {

  return rooms.value.find(
    r => r.id === form.value.room_id
  )
})

/* SELECTED SCHEDULE */
const selectedSchedule = computed(() => {

  return schedules.value.find(
    s => s.id === form.value.schedule_id
  )
})

/* EXTRA PAX */
const extraPax = computed(() => {

  return Math.max(
    0,
    Number(form.value.guests)
    - Number(selectedRoom.value?.max_pax || 0)
  )
})

/* EXTRA PAX TOTAL */
const extraPaxTotal = computed(() => {

  const subtotal =
    extraPax.value *
    Number(form.value.extra_pax_rate)

  return Math.max(
    0,
    subtotal
    - Number(form.value.extra_pax_discount)
  )
})

/* FORMAT TIME */
const formatTime = (time) => {

  if (!time) return ''

  const parts = time.split(':')

  let hour = Number(parts[0])

  const minute = parts[1]

  const ampm = hour >= 12
    ? 'PM'
    : 'AM'

  hour = hour % 12 || 12

  return `${hour}:${minute} ${ampm}`
}

/* TOTAL */
const totalAmount = computed(() => {

  let total = selectedRoom.value
    ? Number(selectedRoom.value.price)
    : 0

  // VIDEOKE
  if (form.value.videoke) {
    total += 500
  }

  // WEEKEND / HOLIDAY
  if (
    form.value.date &&
    (
      isWeekend(form.value.date) ||
      isHoliday(form.value.date)
    )
  ) {
    total += 500
  }

  // EXTRA PAX
  total += extraPaxTotal.value

  return total
})

/* GENERATE DATETIME */
const generateDateTime = () => {

  if (!form.value.date) {

    return {
      start_datetime: null,
      end_datetime: null
    }
  }

  const [
    year,
    month,
    day
  ] = form.value.date
    .split('-')
    .map(Number)

  const start = new Date(
    year,
    month - 1,
    day
  )

  const end = new Date(
    year,
    month - 1,
    day
  )

  if (!selectedSchedule.value) {

    return {
      start_datetime: start,
      end_datetime: end
    }
  }

  const [
    startHour,
    startMinute
  ] =
    selectedSchedule.value
      .start_time
      .split(':')
      .map(Number)

  start.setHours(
    startHour,
    startMinute,
    0,
    0
  )

  const [
    endHour,
    endMinute
  ] =
    selectedSchedule.value
      .end_time
      .split(':')
      .map(Number)

  end.setHours(
    endHour,
    endMinute,
    0,
    0
  )

  // OVERNIGHT
  if (end <= start) {

    end.setDate(
      end.getDate() + 1
    )
  }

  return {
    start_datetime: start,
    end_datetime: end
  }
}

/* SUBMIT */
const submit = async () => {

  loading.value = true

  try {

    const {
      start_datetime,
      end_datetime
    } = generateDateTime()

    await emit('save', {

      ...form.value,

      max_pax:
        selectedRoom.value?.max_pax || 0,

      base_amount:
        selectedRoom.value
          ? Number(selectedRoom.value.price)
          : 0,

      start_datetime,

      end_datetime
    })

    close('addBookingModal')

  } catch (err) {

    console.error(err)

  } finally {

    loading.value = false
  }
}

/* CLOSE */
const closeModal = () => {
  close('addBookingModal')
}
</script>

<style scoped>
.amount-box {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}
</style>