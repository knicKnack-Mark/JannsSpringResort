<template>
  <div class="container-fluid py-4">

    <!-- HEADER -->
    <div
      class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4"
    >
      <div>
        <h3 class="fw-bold mb-1">
          Availability
        </h3>

        <p class="text-muted mb-0">
          Cabin occupancy calendar by schedule
        </p>
      </div>

      <!-- FILTERS -->
      <div class="d-flex flex-wrap gap-2">

        <!-- CABIN -->
        <select
          v-model="selectedCabin"
          class="form-select rounded-4 shadow-sm border-0"
          style="width: 220px"
        >
          <option value="">
            All Cabins
          </option>

          <option
            v-for="cabin in uniqueCabins"
            :key="cabin"
            :value="cabin"
          >
            {{ cabin }}
          </option>
        </select>

        <!-- MONTH -->
        <select
          v-model="selectedMonth"
          class="form-select rounded-4 shadow-sm border-0"
          style="width: 200px"
        >
          <option
            v-for="m in months"
            :key="m.value"
            :value="m.value"
          >
            {{ m.label }}
          </option>
        </select>

      </div>
    </div>

    <!-- SUMMARY -->
    <div class="row g-3 mb-4">

      <div
        v-for="card in summaryCards"
        :key="card.label"
        class="col-6 col-lg-3"
      >
        <div
          class="bg-white rounded-4 shadow-sm border p-3 h-100"
        >
          <small class="text-muted d-block mb-2">
            {{ card.label }}
          </small>

          <h3
            class="fw-bold mb-0"
            :class="card.class"
          >
            {{ card.value }}
          </h3>
        </div>
      </div>

    </div>

    <!-- LEGEND -->
    <div class="d-flex flex-wrap gap-4 align-items-center mb-4">

      <div class="d-flex align-items-center gap-2">
        <span class="legend-dot available-dot"></span>
        <small class="text-muted">
          Available
        </small>
      </div>

      <div class="d-flex align-items-center gap-2">
        <span class="legend-dot day-dot"></span>
        <small class="text-muted">
          Day (9AM-5PM)
        </small>
      </div>

      <div class="d-flex align-items-center gap-2">
        <span class="legend-dot night-dot"></span>
        <small class="text-muted">
          Night (7PM-7AM)
        </small>
      </div>

      <div class="d-flex align-items-center gap-2">
        <span class="legend-dot whole-dot"></span>
        <small class="text-muted">
          Fully Occupied
        </small>
      </div>

    </div>

    <!-- CABINS -->
    <div class="row g-4">

      <div
        v-for="cabin in filteredCabins"
        :key="cabin"
        class="col-12 col-xxl-6"
      >
        <div class="card border-0 shadow-sm rounded-4 h-100">

          <!-- HEADER -->
          <div
            class="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center"
          >
            <div>
              <h4 class="fw-bold mb-1">
                {{ cabin }}
              </h4>

              <small class="text-muted">
                {{ monthLabel }}
              </small>
            </div>

            <span
              class="badge rounded-pill px-3 py-2"
              :class="
                isOccupiedToday(cabin)
                  ? 'text-bg-danger'
                  : 'text-bg-success'
              "
            >
              {{
                isOccupiedToday(cabin)
                  ? "Occupied"
                  : "Available"
              }}
            </span>
          </div>

          <!-- BODY -->
          <div class="card-body p-4">

            <!-- WEEK -->
            <div class="calendar-grid">

              <!-- WEEK DAYS -->
              <div
                v-for="day in weekDays"
                :key="day"
                class="weekday"
              >
                {{ day }}
              </div>

              <!-- DATES -->
              <div
                v-for="date in calendarDates"
                :key="date.full || Math.random()"
                class="calendar-day"
                :class="getDateClass(cabin, date)"
                @click="openSchedules(cabin, date)"
              >
                <template v-if="date.currentMonth">
                  {{ date.number }}
                </template>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="schedule-modal-backdrop"
      @click.self="showModal = false"
    >
      <div class="schedule-modal">

        <div
          class="d-flex justify-content-between align-items-start mb-4"
        >
          <div>
            <h3 class="fw-bold mb-2">
              {{ modalCabin }}
            </h3>

            <p class="text-muted mb-0">
              {{ modalDate }}
            </p>
          </div>

          <button
            class="btn-close"
            @click="showModal = false"
          ></button>
        </div>

        <div class="d-flex flex-column gap-3">

<div
  v-for="sched in modalSchedules"
  :key="sched.label"
  class="schedule-item"
>
  <div>

    <!-- TITLE -->
    <div class="d-flex align-items-center gap-2 mb-2">

      <h5 class="fw-bold mb-0">
        {{ sched.label }}
      </h5>

      <span
        class="badge rounded-pill"
        :class="{
          'bg-primary-subtle text-primary': sched.type === 'day',
          'bg-purple text-white': sched.type === 'night',
          'bg-danger-subtle text-danger': sched.type === 'whole'
        }"
      >
        {{
          sched.type === 'day'
            ? 'Day Tour'
            : sched.type === 'night'
              ? 'Overnight'
              : 'Whole Day'
        }}
      </span>

    </div>

    <!-- DESCRIPTION -->
    <small class="text-muted d-block">

      {{
        sched.type === 'day'
          ? 'Same day booking only'
          : sched.type === 'night'
            ? 'Night stay until next morning'
            : 'Occupies day and overnight schedule'
      }}

    </small>

    <!-- TIME -->
    <small class="text-secondary">
      {{ sched.label }}
    </small>

  </div>

  <!-- STATUS -->
  <span
    class="badge rounded-pill px-3 py-2"
    :class="
      sched.occupied
        ? 'text-bg-danger'
        : 'text-bg-success'
    "
  >
    {{
      sched.occupied
        ? 'Occupied'
        : 'Available'
    }}
  </span>
</div>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import axios from "axios";
import {
  ref,
  computed,
  onMounted,
} from "vue";

definePageMeta({
  layout: "admin",
});

/* =========================
   AXIOS
========================= */
const api = axios.create({
  baseURL:
    "http://127.0.0.1:8000/api",
});

/* =========================
   STATE
========================= */
const bookings = ref([]);

const selectedCabin = ref("");

const selectedMonth = ref(
  new Date().getMonth()
);

const currentYear =
  new Date().getFullYear();

const todayStr = formatDate(
  new Date()
);

const showModal = ref(false);

const modalCabin = ref("");

const modalDate = ref("");

const modalSchedules = ref([]);

const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

/* =========================
   MONTHS
========================= */
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((label, value) => ({
  label,
  value,
}));

/* =========================
   FETCH
========================= */
const fetchBookings =
  async () => {
    try {
      const { data } =
        await api.get(
          "/bookings",
          {
            params: {
              per_page: 1000,
            },
          }
        );

      bookings.value =
        data.data || [];
    } catch (err) {
      console.error(err);
    }
  };

onMounted(fetchBookings);

/* =========================
   HELPERS
========================= */
function formatDate(d) {
  const year =
    d.getFullYear();

  const month = String(
    d.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    d.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(dt) {
  if (!dt) return null;

  return new Date(dt);
}

/* =========================
   CABINS
========================= */
const uniqueCabins =
  computed(() => [
    ...new Set(
      bookings.value.map(
        (b) => b.cabin
      )
    ),
  ]);

const filteredCabins =
  computed(() =>
    selectedCabin.value
      ? uniqueCabins.value.filter(
          (c) =>
            c ===
            selectedCabin.value
        )
      : uniqueCabins.value
  );

/* =========================
   MONTH
========================= */
const currentMonth =
  computed(
    () =>
      new Date(
        currentYear,
        selectedMonth.value,
        1
      )
  );

const monthLabel =
  computed(() =>
    currentMonth.value.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    )
  );

/* =========================
   CALENDAR
========================= */
const calendarDates =
  computed(() => {
    const dates = [];

    const year =
      currentMonth.value.getFullYear();

    const month =
      currentMonth.value.getMonth();

    const first = new Date(
      year,
      month,
      1
    );

    const last = new Date(
      year,
      month + 1,
      0
    );

    Array.from({
      length: first.getDay(),
    }).forEach(() =>
      dates.push({
        currentMonth: false,
      })
    );

    Array.from({
      length: last.getDate(),
    }).forEach((_, i) => {
      const d = new Date(
        year,
        month,
        i + 1
      );

      dates.push({
        currentMonth: true,
        number: i + 1,
        full: formatDate(d),
      });
    });

    return dates;
  });

/* =========================
   OVERLAP
========================= */
function hasConflict(
  cabin,
  start,
  end
) {
  return bookings.value.some(
    (b) => {
      if (
        b.cabin !== cabin
      )
        return false;

      if (
        b.status ===
        "cancelled"
      )
        return false;

      const bookingStart =
        parseDate(
          b.start_datetime
        );

      const bookingEnd =
        parseDate(
          b.end_datetime
        );

      return (
        bookingStart <= end &&
        bookingEnd >= start
      );
    }
  );
}

/* =========================
   SCHEDULES
========================= */
function getSchedules(
  cabin,
  date
) {
  const base =
    new Date(date);

  const next =
    new Date(date);

  next.setDate(
    next.getDate() + 1
  );

  const schedules = [
    {
      label: "9AM - 5PM",

      start: new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        9,
        0
      ),

      end: new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        17,
        0
      ),

      type: "day",
    },

    {
      label: "7PM - 7AM",

      start: new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        19,
        0
      ),

      end: new Date(
        next.getFullYear(),
        next.getMonth(),
        next.getDate(),
        7,
        0
      ),

      type: "night",
    },

    {
      label: "9AM - 7AM",

      start: new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        9,
        0
      ),

      end: new Date(
        next.getFullYear(),
        next.getMonth(),
        next.getDate(),
        7,
        0
      ),

      type: "whole",
    },

    {
      label: "7PM - 5PM",

      start: new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        19,
        0
      ),

      end: new Date(
        next.getFullYear(),
        next.getMonth(),
        next.getDate(),
        17,
        0
      ),

      type: "whole",
    },
  ];

  return schedules.map(
    (s) => ({
      ...s,
      occupied:
        hasConflict(
          cabin,
          s.start,
          s.end
        ),
    })
  );
}

/* =========================
   DATE STATUS
========================= */
function getDateStatus(
  cabin,
  date
) {
  const schedules =
    getSchedules(
      cabin,
      date
    );

  const allOccupied =
    schedules.every(
      (s) => s.occupied
    );

  const hasWhole =
    schedules.some(
      (s) =>
        s.type ===
          "whole" &&
        s.occupied
    );

  const hasNight =
    schedules.some(
      (s) =>
        s.type ===
          "night" &&
        s.occupied
    );

  const hasDay =
    schedules.some(
      (s) =>
        s.type ===
          "day" &&
        s.occupied
    );

  return {
    allOccupied,
    hasWhole,
    hasNight,
    hasDay,
  };
}

/* =========================
   DATE CLASS
========================= */
function getDateClass(
  cabin,
  date
) {
  if (
    !date.currentMonth
  ) {
    return "empty";
  }

  const status =
    getDateStatus(
      cabin,
      date.full
    );

  if (
    status.allOccupied
  ) {
    return {
      whole: true,
      today:
        date.full ===
        todayStr,
    };
  }

  if (
    status.hasWhole ||
    status.hasNight
  ) {
    return {
      night: true,
      today:
        date.full ===
        todayStr,
    };
  }

  if (status.hasDay) {
    return {
      day: true,
      today:
        date.full ===
        todayStr,
    };
  }

  return {
    available: true,
    today:
      date.full ===
      todayStr,
  };
}

/* =========================
   MODAL
========================= */
function openSchedules(
  cabin,
  date
) {
  if (
    !date.currentMonth
  )
    return;

  modalCabin.value =
    cabin;

  modalDate.value =
    date.full;

  modalSchedules.value =
    getSchedules(
      cabin,
      date.full
    );

  showModal.value =
    true;
}

/* =========================
   TODAY
========================= */
function isOccupiedToday(
  cabin
) {
  const status =
    getDateStatus(
      cabin,
      todayStr
    );

  return (
    status.allOccupied ||
    status.hasWhole ||
    status.hasNight ||
    status.hasDay
  );
}

/* =========================
   SUMMARY
========================= */
const occupiedToday =
  computed(
    () =>
      uniqueCabins.value.filter(
        (c) =>
          isOccupiedToday(
            c
          )
      ).length
  );

const summaryCards =
  computed(() => [
    {
      label:
        "Total Cabins",

      value:
        uniqueCabins.value
          .length,

      class:
        "text-dark",
    },

    {
      label:
        "Available Today",

      value:
        uniqueCabins.value
          .length -
        occupiedToday.value,

      class:
        "text-success",
    },

    {
      label:
        "Occupied Today",

      value:
        occupiedToday.value,

      class:
        "text-danger",
    },

    {
      label:
        "Total Bookings",

      value:
        bookings.value
          .length,

      class:
        "text-primary",
    },
  ]);
</script>

<style scoped>
/* =========================
   LEGEND
========================= */
.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.available-dot {
  background: #cbd5e1;
}

.day-dot {
  background: #3b82f6;
}

.night-dot {
  background: #ee7d32;
}

.whole-dot {
  background: #dc2626;
}

/* =========================
   CALENDAR
========================= */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
  margin-top: 20px;
}

.weekday {
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
}

/* =========================
   DATE CELL
========================= */
.calendar-day {
  height: 58px;

  border-radius: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: 700;

  transition: .2s ease;

  border: 1px solid #e2e8f0;

  cursor: pointer;
}

.calendar-day:hover {
  transform: translateY(-1px);
}

/* EMPTY */
.calendar-day.empty {
  background: transparent;
  border: none;
  cursor: default;
}

/* AVAILABLE */
.calendar-day.available {
  background: #fff;
  color: #334155;
}

/* DAY */
.calendar-day.day {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: #bfdbfe;
}

/* NIGHT */
.calendar-day.night {
  background: #fde6d8;
  color: #9d3f0e;
  border-color: #f5c3a3;
}

/* WHOLE */
.calendar-day.whole {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}

/* TODAY */
.calendar-day.today {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}

/* =========================
   MODAL BACKDROP
========================= */
.schedule-modal-backdrop {
  position: fixed;
  inset: 0;

  background: rgba(0,0,0,.45);

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
}

/* =========================
   MODAL
========================= */
.schedule-modal {
  width: 100%;
  max-width: 780px;

  background: #fff;

  border-radius: 24px;

  padding: 26px;

  box-shadow:
    0 10px 40px rgba(0,0,0,.12);

  animation: modalIn .2s ease;
}

/* =========================
   ITEM
========================= */
.schedule-item {
  border: 1px solid #e2e8f0;

  border-radius: 18px;

  padding: 16px 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;

  min-height: 88px;

  transition: .2s ease;
}

.schedule-item:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

/* =========================
   TITLE
========================= */
.schedule-item h5 {
  font-size: 17px;
  margin-bottom: 0 !important;
}

/* =========================
   TEXT
========================= */
.schedule-item small {
  font-size: 12px;
  line-height: 1.25;
}

/* =========================
   BADGES
========================= */
.schedule-item .badge {
  font-size: 11px;
  font-weight: 600;
}

.bg-purple {
  background: #7c3aed;
}

/* =========================
   CARD
========================= */
.card {
  overflow: hidden;
  border: 1px solid #e2e8f0 !important;
}

/* =========================
   ANIMATION
========================= */
@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(.96);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* =========================
   MOBILE
========================= */
@media (max-width: 768px) {

  .calendar-grid {
    gap: 6px;
  }

  .calendar-day {
    height: 42px;
    font-size: 12px;
    border-radius: 12px;
  }

  .schedule-modal {
    padding: 20px;
    border-radius: 20px;
  }

  .schedule-item {
    padding: 14px;
    min-height: auto;
  }

  .schedule-item h5 {
    font-size: 15px;
  }

}
</style>