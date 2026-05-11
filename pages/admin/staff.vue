<template>
  <div>

    <!-- PAGE TITLE -->
    <div class="mb-4">
      <h4 class="fw-bold mb-1">
        Staff Attendance
      </h4>

      <p class="text-muted mb-0">
        Enter staff ID to Time In / Time Out
      </p>
    </div>

    <!-- SUMMARY -->
    <div class="row g-3 mb-4">

      <div
        class="col-12 col-md-6 col-xl-3"
        v-for="card in summaryCards"
        :key="card.label"
      >
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body">

            <p class="text-muted small mb-2">
              {{ card.label }}
            </p>

            <h3
              class="fw-bold mb-0"
              :class="card.class"
            >
              {{ card.value }}
            </h3>

          </div>
        </div>
      </div>

    </div>

    <!-- ATTENDANCE INPUT -->
    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-4">

        <div class="row g-3 align-items-center">

          <!-- INPUT -->
          <div class="col-12 col-md">
            <input
              v-model="staffIdInput"
              type="text"
              class="form-control form-control-lg rounded-4"
              placeholder="Enter Staff ID"
              @keyup.enter="handleAttendance"
            />
          </div>

          <!-- BUTTON -->
          <div class="col-12 col-md-auto">
            <button
              class="btn btn-lg text-white rounded-4 px-4 w-100"
              style="background: #ff6b2c"
              @click="handleAttendance"
            >
              Submit
            </button>
          </div>

        </div>

      </div>
    </div>

    <!-- ALERT -->
    <div
      v-if="message"
      class="alert rounded-4 border-0 shadow-sm"
      :class="messageType"
    >
      {{ message }}
    </div>

    <!-- STAFF TABLE -->
    <div class="card border-0 shadow-sm rounded-4">
      <div class="card-body p-0">

        <div class="table-responsive">

          <table class="table align-middle mb-0">

            <!-- HEAD -->
            <thead class="table-light">
              <tr>
                <th class="px-4 py-3">Staff ID</th>
                <th class="py-3">Name</th>
                <th class="py-3">Attendance</th>
                <th class="py-3">Employment</th>
                <th class="py-3">Time In</th>
                <th class="py-3">Time Out</th>
                <th class="py-3">Rendered Hours</th>
                <th class="py-3">Actions</th>
              </tr>
            </thead>

            <!-- BODY -->
            <tbody>

              <tr
                v-for="staff in staffs"
                :key="staff.id"
              >

                <!-- ID -->
                <td class="px-4 py-3 fw-semibold">
                  {{ staff.id }}
                </td>

                <!-- NAME -->
                <td class="py-3 fw-semibold">
                  {{ staff.name }}
                </td>

                <!-- ATTENDANCE -->
                <td class="py-3">

                  <span
                    class="badge rounded-pill px-3 py-2"
                    :class="attendanceBadge(staff)"
                  >
                    {{ staff.status }}
                  </span>

                </td>

                <!-- EMPLOYMENT -->
                <td class="py-3">

                  <span
                    class="badge rounded-pill px-3 py-2"
                    :class="
                      staff.active
                        ? 'bg-success-subtle text-success'
                        : 'bg-danger-subtle text-danger'
                    "
                  >
                    {{ staff.active ? 'ACTIVE' : 'INACTIVE' }}
                  </span>

                </td>

                <!-- TIME IN -->
                <td class="py-3 text-muted">
                  {{
                    staff.time_in
                      ? formatTime(staff.time_in)
                      : '--:--'
                  }}
                </td>

                <!-- TIME OUT -->
                <td class="py-3 text-muted">
                  {{
                    staff.time_out
                      ? formatTime(staff.time_out)
                      : '--:--'
                  }}
                </td>

                <!-- RENDERED HOURS -->
                <td class="py-3 fw-semibold text-dark">
                  {{ staff.rendered_hours }} hrs
                </td>

                <!-- ACTIONS -->
                <td class="py-3">

                  <div class="d-flex gap-2 flex-wrap">

                    <!-- TIME IN / OUT -->
                    <button
                      class="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                      :class="
                        staff.status === 'IN'
                          ? 'btn-danger'
                          : 'btn-success'
                      "
                      style="width: 38px; height: 38px;"
                      :disabled="
                        !staff.active ||
                        staff.status === 'ABSENT'
                      "
                      :title="
                        staff.status === 'IN'
                          ? 'Time Out'
                          : 'Time In'
                      "
                      @click="manualAttendance(staff)"
                    >
                      <Icon
                        :name="
                          staff.status === 'IN'
                            ? 'mdi:logout'
                            : 'mdi:login'
                        "
                        size="18"
                      />
                    </button>

                    <!-- ABSENT -->
                    <button
                      class="btn btn-sm btn-warning rounded-circle d-flex align-items-center justify-content-center"
                      style="width: 38px; height: 38px;"
                      :disabled="
                        !staff.active ||
                        staff.status === 'IN'
                      "
                      title="Mark Absent"
                      @click="markAbsent(staff)"
                    >
                      <Icon
                        name="mdi:account-off"
                        size="18"
                      />
                    </button>

                    <!-- ACTIVE / INACTIVE -->
                    <button
                      class="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                      style="width: 38px; height: 38px;"
                      :class="
                        staff.active
                          ? 'btn-outline-danger'
                          : 'btn-outline-success'
                      "
                      :title="
                        staff.active
                          ? 'Set Inactive'
                          : 'Set Active'
                      "
                      @click="toggleActive(staff)"
                    >
                      <Icon
                        :name="
                          staff.active
                            ? 'mdi:account-cancel'
                            : 'mdi:account-check'
                        "
                        size="18"
                      />
                    </button>

                  </div>

                </td>

              </tr>

              <!-- EMPTY -->
              <tr v-if="!staffs.length">
                <td
                  colspan="8"
                  class="text-center text-muted py-5"
                >
                  No attendance records yet
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  layout: "admin",
});

/* INPUT */
const staffIdInput = ref("");

/* ALERT */
const message = ref("");
const messageType = ref("alert-success");

/* STAFF LIST */
const staffs = ref([
  {
    id: "1001",
    name: "Juan Dela Cruz",
    status: "OUT",
    active: true,
    time_in: null,
    time_out: null,
    rendered_hours: 0,
  },
  {
    id: "1002",
    name: "Maria Santos",
    status: "OUT",
    active: true,
    time_in: null,
    time_out: null,
    rendered_hours: 0,
  },
  {
    id: "1003",
    name: "Pedro Reyes",
    status: "ABSENT",
    active: false,
    time_in: null,
    time_out: null,
    rendered_hours: 0,
  },
]);

/* SUMMARY */
const summaryCards = computed(() => [

  {
    label: "Total Staff",
    value: staffs.value.length,
  },

  {
    label: "Currently In",
    value: staffs.value.filter(
      (s) => s.status === "IN"
    ).length,
    class: "text-success",
  },

  {
    label: "Absent",
    value: staffs.value.filter(
      (s) => s.status === "ABSENT"
    ).length,
    class: "text-warning",
  },

  {
    label: "Inactive",
    value: staffs.value.filter(
      (s) => !s.active
    ).length,
    class: "text-danger",
  },

]);

/* HANDLE INPUT ATTENDANCE */
const handleAttendance = () => {

  const input = staffIdInput.value.trim();

  if (!input) return;

  const staff = staffs.value.find(
    (s) => s.id === input
  );

  if (!staff) {

    showMessage(
      "Staff ID not found",
      "alert-danger"
    );

    staffIdInput.value = "";
    return;
  }

  if (!staff.active) {

    showMessage(
      `${staff.name} is inactive`,
      "alert-danger"
    );

    return;
  }

  if (staff.status === "ABSENT") {

    showMessage(
      `${staff.name} is marked absent`,
      "alert-warning"
    );

    return;
  }

  manualAttendance(staff);

  staffIdInput.value = "";
};

/* MANUAL ATTENDANCE */
const manualAttendance = (staff) => {

  if (!staff.active) return;

  /* TIME IN */
  if (staff.status === "OUT") {

    staff.status = "IN";

    staff.time_in = new Date();

    staff.time_out = null;

    showMessage(
      `${staff.name} timed in successfully`,
      "alert-success"
    );
  }

  /* TIME OUT */
  else if (staff.status === "IN") {

    staff.status = "OUT";

    staff.time_out = new Date();

    /* COMPUTE HOURS */
    const diffMs =
      staff.time_out - staff.time_in;

    const hours =
      diffMs / 1000 / 60 / 60;

    staff.rendered_hours =
      Number(staff.rendered_hours) +
      Number(hours.toFixed(2));

    showMessage(
      `${staff.name} timed out successfully`,
      "alert-warning"
    );
  }
};

/* MARK ABSENT */
const markAbsent = (staff) => {

  if (
    !staff.active ||
    staff.status === "IN"
  ) {
    return;
  }

  staff.status = "ABSENT";

  staff.time_in = null;

  staff.time_out = null;

  showMessage(
    `${staff.name} marked absent`,
    "alert-warning"
  );
};

/* TOGGLE ACTIVE */
const toggleActive = (staff) => {

  staff.active = !staff.active;

  /* RESET WHEN INACTIVE */
  if (!staff.active) {

    staff.status = "OUT";

    staff.time_in = null;

    staff.time_out = null;
  }

  showMessage(
    `${staff.name} employment updated`,
    "alert-info"
  );
};

/* BADGE COLOR */
const attendanceBadge = (staff) => {

  if (staff.status === "IN") {
    return "bg-success-subtle text-success";
  }

  if (staff.status === "ABSENT") {
    return "bg-warning-subtle text-warning";
  }

  return "bg-secondary-subtle text-secondary";
};

/* CURRENT TIME */
const currentTime = () => {

  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* FORMAT TIME */
const formatTime = (date) => {

  return new Date(date)
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
};

/* ALERT */
const showMessage = (msg, type) => {

  message.value = msg;

  messageType.value = type;

  setTimeout(() => {
    message.value = "";
  }, 3000);
};
</script>