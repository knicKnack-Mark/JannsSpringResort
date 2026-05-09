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

      <h6 class="text-muted mb-2 fw-semibold small">Guest Information</h6>

      <div class="row g-2 mb-3">
        <div class="col-md-6">
          <label class="form-label">Name</label>
          <input v-model="form.name" type="text" class="form-control form-control-sm" />
        </div>

        <div class="col-md-6">
          <label class="form-label">Address</label>
          <input v-model="form.address" type="text" class="form-control form-control-sm" />
        </div>
      </div>

<<<<<<< HEAD
          <h6 class="text-muted mb-2 fw-semibold small">Guest Information</h6>

          <div class="row g-2 mb-3">
            <div class="col-md-6">
              <label class="form-label">Name</label>
              <input v-model="form.name" type="text" class="form-control form-control-sm" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Address</label>
              <input v-model="form.address" type="text" class="form-control form-control-sm" />
            </div>
          </div>

          <h6 class="text-muted mb-2 fw-semibold small">Booking Details</h6>

          <div class="row g-2 mb-3">
            <div class="col-md-6">
              <label class="form-label">Cabin</label>
              <select v-model="form.cabin" class="form-select form-select-sm">
                <option 
                  v-for="room in rooms" 
                  :key="room.id" 
                  :value="room.name"
                >
                  {{ room.name }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Date</label>
              <input v-model="form.date" type="date" class="form-control form-control-sm" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Time</label>
              <select v-model="form.time" class="form-select form-select-sm">
                <option value="8:00 AM - 5:00 PM">Day (8 AM - 5 PM)</option>
                <option value="7:00 PM - 7:00 AM">Night (7 PM - 7 AM)</option>
                <option value="2:00 PM - 12:00 AM">Half Day (2 PM - 12 AM)</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Guests</label>
              <input v-model="form.guests" type="number" class="form-control form-control-sm" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Videoke</label>
              <select v-model="form.videoke" class="form-select form-select-sm">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Paid</label>
              <input v-model="form.paid" type="number" class="form-control form-control-sm" />
            </div>
          </div>

          <!-- PRICE -->
          <div class="amount-box p-2 rounded-3 small mb-2">

            <div class="d-flex justify-content-between">
              <span>Cabin</span>
              <span>₱{{ getRoomPrice(form.cabin).toLocaleString() }}</span>
            </div>

            <div v-if="form.videoke" class="d-flex justify-content-between">
              <span>Videoke</span>
              <span>+ ₱500</span>
            </div>

            <div
              v-if="form.date && (isWeekend(form.date) || isHoliday(form.date))"
              class="d-flex justify-content-between text-warning"
            >
              <span>Weekend / Holiday</span>
              <span>+ ₱500</span>
            </div>

            <hr class="my-2" />

            <div class="d-flex justify-content-between fw-semibold text-success">
              <span>Total</span>
              <span>₱{{ totalAmount.toLocaleString() }}</span>
            </div>

          </div>
=======
      <h6 class="text-muted mb-2 fw-semibold small">Booking Details</h6>
>>>>>>> fffd9687b6f06c74d330effa86dfa094d4e39ac3

      <div class="row g-2 mb-3">
        <div class="col-md-6">
          <label class="form-label">Cabin</label>
          <select v-model="form.cabin" class="form-select form-select-sm">
            <option>Talisay Cabin</option>
            <option>Malobago Cabin</option>
          </select>
        </div>

        <div class="col-md-6">
          <label class="form-label">Date</label>
          <input v-model="form.date" type="date" class="form-control form-control-sm" />
        </div>

        <div class="col-md-6">
          <label class="form-label">Time</label>
          <select v-model="form.time" class="form-select form-select-sm">
            <option value="8:00 AM - 5:00 PM">Day (8 AM - 5 PM)</option>
            <option value="7:00 PM - 7:00 AM">Night</option>
            <option value="2:00 PM - 12:00 AM">Half Day</option>
          </select>
        </div>

        <div class="col-md-6">
          <label class="form-label">Guests</label>
          <input v-model="form.guests" type="number" class="form-control form-control-sm" />
        </div>

        <div class="col-md-6">
          <label class="form-label">Videoke</label>
          <select v-model="form.videoke" class="form-select form-select-sm">
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </div>

        <div class="col-md-6">
          <label class="form-label">Paid</label>
          <input v-model="form.paid" type="number" class="form-control form-control-sm" />
        </div>
      </div>

      <!-- PRICE -->
      <div class="amount-box p-2 rounded-3 small mb-2">

        <div class="d-flex justify-content-between">
          <span>Cabin</span>
          <span>₱{{ form.cabin === "Talisay Cabin" ? "4,500" : "4,000" }}</span>
        </div>

        <div v-if="form.videoke" class="d-flex justify-content-between">
          <span>Videoke</span>
          <span>+ ₱500</span>
        </div>

        <div
          v-if="form.date && (isWeekend(form.date) || isHoliday(form.date))"
          class="d-flex justify-content-between text-warning"
        >
          <span>Weekend / Holiday</span>
          <span>+ ₱500</span>
        </div>

        <hr class="my-2" />

        <div class="d-flex justify-content-between fw-semibold text-success">
          <span>Total</span>
          <span>₱{{ totalAmount.toLocaleString() }}</span>
        </div>

      </div>

    </div>

    <!-- FOOTER -->
    <template #footer>
      <button class="btn btn-light btn-sm px-3" @click="closeModal">
        Cancel
      </button>

      <button
        class="btn btn-primary btn-sm px-3 d-flex align-items-center gap-1"
        :disabled="loading"
        @click="submit"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm"></span>
        <Icon name="mdi:content-save" />
        Save
      </button>
    </template>

  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import { useModal } from "@/composables/useModal";

const props = defineProps({ editData: Object });
const emit = defineEmits(["save"]);

<<<<<<< HEAD
/* =========================
   ROOMS (NEW)
========================= */
const rooms = ref([]);

const fetchRooms = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/rooms");
    const data = await res.json();

    rooms.value = data;

    if (data.length > 0) {
      form.value.cabin = data[0].name;
    }
  } catch (err) {
    console.error("Failed to fetch rooms:", err);
  }
};

onMounted(fetchRooms);

/* =========================
   FORM
========================= */
=======
const { close } = useModal();
const loading = ref(false);

/* FORM */
>>>>>>> fffd9687b6f06c74d330effa86dfa094d4e39ac3
const form = ref({
  name: "",
  address: "",
  cabin: "",
  date: "",
  time: "8:00 AM - 5:00 PM",
  guests: 1,
  videoke: false,
  paid: 0,
});

<<<<<<< HEAD
/* =========================
   EDIT MODE
========================= */
watch(
  () => props.editData,
  (val) => {
    if (val) {
      const start = parseLocal(val.start_datetime);

      form.value = {
        ...form.value,
        name: val.name,
        address: val.address,
        cabin: val.cabin,
        guests: val.guests,
        videoke: val.videoke,
        date: start.toISOString().split("T")[0],
        time: detectTimeRange(val.start_datetime, val.end_datetime),
      };
    }
  },
  { immediate: true }
);

const parseLocal = (dt) => {
  if (!dt) return null;
  return new Date(dt.replace("T", " ").replace("Z", "").split(".")[0]);
};

/* =========================
   TIME
========================= */
const formatForBackend = (date) => {
  const pad = (n) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

const generateDateTime = () => {
  const base = new Date(form.value.date);

  let start, end;

  if (form.value.time === "8:00 AM - 5:00 PM") {
    start = new Date(base);
    start.setHours(8, 0, 0);

    end = new Date(base);
    end.setHours(17, 0, 0);
  } else if (form.value.time === "7:00 PM - 7:00 AM") {
    start = new Date(base);
    start.setHours(19, 0, 0);

    end = new Date(base);
    end.setHours(7, 0, 0);
    end.setDate(end.getDate() + 1);
  } else {
    start = new Date(base);
    start.setHours(14, 0, 0);

    end = new Date(base);
    end.setHours(0, 0, 0);
    end.setDate(end.getDate() + 1);
  }

  return {
    start_datetime: formatForBackend(start),
    end_datetime: formatForBackend(end),
=======
/* EDIT MODE */
watch(() => props.editData, (val) => {
  if (!val) return;

  const start = new Date(val.start_datetime);

  form.value = {
    ...form.value,
    name: val.name,
    address: val.address,
    cabin: val.cabin,
    guests: val.guests,
    videoke: val.videoke,
    date: start.toISOString().split("T")[0],
    time: "8:00 AM - 5:00 PM"
>>>>>>> fffd9687b6f06c74d330effa86dfa094d4e39ac3
  };
});

<<<<<<< HEAD
const detectTimeRange = (start, end) => {
  const s = parseLocal(start);
  const e = parseLocal(end);

  if (s.getHours() === 8 && e.getHours() === 17) return "8:00 AM - 5:00 PM";
  if (s.getHours() === 19 && e.getHours() === 7) return "7:00 PM - 7:00 AM";
  if (s.getHours() === 14 && e.getHours() === 0) return "2:00 PM - 12:00 AM";

  return "8:00 AM - 5:00 PM";
};

/* =========================
   PRICE
========================= */
const getRoomPrice = (name) => {
  const room = rooms.value.find(r => r.name === name);
  return room ? Number(room.price) : 0;
};

=======
/* PRICE */
>>>>>>> fffd9687b6f06c74d330effa86dfa094d4e39ac3
const isWeekend = (date) => {
  const d = new Date(date);
  return d.getDay() === 0 || d.getDay() === 6;
};

const holidays = ["2026-01-01","2026-04-09","2026-06-12","2026-12-25"];
const isHoliday = (date) => holidays.includes(date);

const totalAmount = computed(() => {
  let base = getRoomPrice(form.value.cabin);

  if (form.value.videoke) base += 500;
  if (form.value.date && (isWeekend(form.value.date) || isHoliday(form.value.date))) {
    base += 500;
  }

  return base;
});

<<<<<<< HEAD
/* =========================
   SUBMIT
========================= */
const submit = () => {
=======
/* GENERATE DATETIME */
const generateDateTime = () => {
  const base = new Date(form.value.date);
  let start = new Date(base);
  let end = new Date(base);

  if (form.value.time.includes("8:00")) {
    start.setHours(8); end.setHours(17);
  } else if (form.value.time.includes("7:00 PM")) {
    start.setHours(19); end.setHours(7); end.setDate(end.getDate() + 1);
  } else {
    start.setHours(14); end.setHours(0); end.setDate(end.getDate() + 1);
  }

  return {
    start_datetime: start,
    end_datetime: end
  };
};

/* SUBMIT */
const submit = async () => {
  loading.value = true;

>>>>>>> fffd9687b6f06c74d330effa86dfa094d4e39ac3
  const { start_datetime, end_datetime } = generateDateTime();

  await emit("save", {
    ...form.value,
    amount: totalAmount.value,
    start_datetime,
    end_datetime
  });
<<<<<<< HEAD
=======

  loading.value = false;

  close("addBookingModal");
>>>>>>> fffd9687b6f06c74d330effa86dfa094d4e39ac3
};

<<<<<<< HEAD
<style scoped>
.modal-fit { max-width: 650px; }
.modal-content { font-size: 14px; max-height: 90vh; display: flex; flex-direction: column; }
.modal-body { overflow-y: auto; max-height: calc(90vh - 120px); }
.form-label { font-size: 12.5px; margin-bottom: 3px; }
.amount-box { background: #f8fafc; border: 1px dashed #ddd; }
.form-control, .form-select { border-radius: 8px; }
.form-control:focus, .form-select:focus {
  border-color: #ff6b2c;
  box-shadow: 0 0 0 0.1rem rgba(255, 107, 44, 0.2);
}
</style>
=======
/* CLOSE */
const closeModal = () => close("addBookingModal");
</script>
>>>>>>> fffd9687b6f06c74d330effa86dfa094d4e39ac3
