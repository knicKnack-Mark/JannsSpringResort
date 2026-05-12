<template>
  <div class="container-fluid py-4">
    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-1">Staff Payroll Management</h2>
        <p class="text-muted mb-0">
          Monitor salaries, attendance, expenses, deductions, and net pay.
        </p>
      </div>

      <button class="btn btn-primary" @click="printPayroll">
        <i class="bi bi-printer me-2"></i>
        Print Payroll
      </button>
    </div>

    <!-- SUMMARY CARDS -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted">Total Staff</small>
                <h3 class="fw-bold mb-0">{{ staffs.length }}</h3>
              </div>

              <div class="icon-box bg-primary-subtle text-primary">
                <i class="bi bi-people-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted">Total Salaries</small>
                <h3 class="fw-bold mb-0">
                  ₱ {{ formatMoney(totalSalary) }}
                </h3>
              </div>

              <div class="icon-box bg-success-subtle text-success">
                <i class="bi bi-cash-stack"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted">Total Deductions</small>
                <h3 class="fw-bold mb-0 text-danger">
                  ₱ {{ formatMoney(totalDeductions) }}
                </h3>
              </div>

              <div class="icon-box bg-danger-subtle text-danger">
                <i class="bi bi-dash-circle-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted">Net Payroll</small>
                <h3 class="fw-bold mb-0 text-primary">
                  ₱ {{ formatMoney(totalNetPay) }}
                </h3>
              </div>

              <div class="icon-box bg-info-subtle text-info">
                <i class="bi bi-wallet2"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FILTERS -->
    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label">Search Staff</label>
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Search by name..."
            />
          </div>

          <div class="col-md-3">
            <label class="form-label">Month</label>
            <input
              v-model="month"
              type="month"
              class="form-control"
            />
          </div>

          <div class="col-md-2">
            <button class="btn btn-dark w-100">
              <i class="bi bi-search me-2"></i>
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-header bg-white py-3 border-bottom">
        <h5 class="mb-0 fw-semibold">Payroll Summary</h5>
      </div>

      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Staff</th>
              <th>Attendance</th>
              <th>Salary</th>
              <th>Expenses</th>
              <th>Deductions</th>
              <th>Net Pay</th>
              <th width="150">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="staff in filteredStaffs" :key="staff.id">
              <td>
                <div class="d-flex align-items-center gap-3">
                  <div class="avatar">
                    {{ initials(staff.name) }}
                  </div>

                  <div>
                    <div class="fw-semibold">{{ staff.name }}</div>
                    <small class="text-muted">{{ staff.position }}</small>
                  </div>
                </div>
              </td>

              <td>
                <span class="badge bg-success-subtle text-success px-3 py-2">
                  {{ staff.attendance }} Days
                </span>
              </td>

              <td width="220">
                <div class="d-flex flex-column gap-2">
                  <select
                    v-model="staff.salary_type"
                    class="form-select form-select-sm"
                  >
                    <option value="daily">Daily Rate</option>
                    <option value="monthly">Monthly Rate</option>
                  </select>

                  <div class="input-group input-group-sm">
                    <span class="input-group-text">₱</span>
                    <input
                      v-model.number="staff.rate"
                      type="number"
                      class="form-control"
                    />
                  </div>

                  <small class="text-muted">
                    Computed Salary:
                    ₱ {{ formatMoney(computedSalary(staff)) }}
                  </small>
                </div>
              </td>

              <td>
                <div class="input-group input-group-sm">
                  <span class="input-group-text">₱</span>
                  <input
                    v-model.number="staff.expenses"
                    type="number"
                    class="form-control"
                  />
                </div>
              </td>

              <td>
                <div class="input-group input-group-sm">
                  <span class="input-group-text">₱</span>
                  <input
                    v-model.number="staff.deductions"
                    type="number"
                    class="form-control"
                  />
                </div>
              </td>

              <td class="fw-bold text-primary">
                ₱ {{ formatMoney(netPay(staff)) }}
              </td>

              <td>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-save"></i>
                  </button>

                  <button class="btn btn-sm btn-outline-success">
                    <i class="bi bi-printer"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredStaffs.length === 0">
              <td colspan="7" class="text-center py-5 text-muted">
                No staff records found.
              </td>
            </tr>
          </tbody>

          <tfoot class="table-light fw-bold">
            <tr>
              <td colspan="2">TOTAL</td>
              <td>₱ {{ formatMoney(totalSalary) }}</td>
              <td class="text-warning">
                ₱ {{ formatMoney(totalExpenses) }}
              </td>
              <td class="text-danger">
                ₱ {{ formatMoney(totalDeductions) }}
              </td>
              <td class="text-primary">
                ₱ {{ formatMoney(totalNetPay) }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { computed, ref } from 'vue'

const search = ref('')
const month = ref('')

const staffs = ref([
  {
    id: 1,
    name: 'John Doe',
    position: 'Receptionist',
    attendance: 26,
    salary_type: 'monthly',
    rate: 18000,
    expenses: 1500,
    deductions: 1000,
  },
  {
    id: 2,
    name: 'Jane Smith',
    position: 'Housekeeping',
    attendance: 24,
    salary_type: 'daily',
    rate: 700,
    expenses: 800,
    deductions: 500,
  },
  {
    id: 3,
    name: 'Michael Cruz',
    position: 'Security Guard',
    attendance: 27,
    salary_type: 'monthly',
    rate: 20000,
    expenses: 1200,
    deductions: 700,
  },
])

const filteredStaffs = computed(() => {
  return staffs.value.filter((staff) => {
    return staff.name
      .toLowerCase()
      .includes(search.value.toLowerCase())
  })
})

const computedSalary = (staff) => {
  if (staff.salary_type === 'daily') {
    return staff.rate * staff.attendance
  }

  return staff.rate
}

const netPay = (staff) => {
  return computedSalary(staff) - staff.expenses - staff.deductions
}

const totalSalary = computed(() => {
  return staffs.value.reduce((sum, staff) => sum + computedSalary(staff), 0)
})

const totalExpenses = computed(() => {
  return staffs.value.reduce((sum, staff) => sum + staff.expenses, 0)
})

const totalDeductions = computed(() => {
  return staffs.value.reduce((sum, staff) => sum + staff.deductions, 0)
})

const totalNetPay = computed(() => {
  return staffs.value.reduce((sum, staff) => sum + netPay(staff), 0)
})

const formatMoney = (value) => {
  return Number(value).toLocaleString()
}

const initials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}

const printPayroll = () => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const peso = 'PHP'

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('Staff Payroll Report', 14, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26)

  const rows = staffs.value.map((staff) => {
    return [
      staff.name,
      staff.position,
      `${staff.attendance} Days`,
      staff.salary_type === 'daily' ? 'Daily Rate' : 'Monthly Rate',
      `${peso} ${formatMoney(staff.rate)}`,
      `${peso} ${formatMoney(computedSalary(staff))}`,
      `${peso} ${formatMoney(staff.expenses)}`,
      `${peso} ${formatMoney(staff.deductions)}`,
      `${peso} ${formatMoney(netPay(staff))}`,
    ]
  })

  autoTable(doc, {
    startY: 35,
    theme: 'grid',
    headStyles: {
      fillColor: [13, 110, 253],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 4,
      valign: 'middle',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    styles: {
      overflow: 'linebreak',
      cellWidth: 'wrap',
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 35 },
      2: { halign: 'center', cellWidth: 25 },
      3: { halign: 'center', cellWidth: 30 },
      4: { halign: 'right', cellWidth: 30 },
      5: { halign: 'right', cellWidth: 32 },
      6: { halign: 'right', cellWidth: 28 },
      7: { halign: 'right', cellWidth: 30 },
      8: { halign: 'right', cellWidth: 32 },
    },
    head: [[
      'Employee',
      'Position',
      'Attendance',
      'Salary Type',
      'Rate',
      'Gross Salary',
      'Expenses',
      'Deductions',
      'Net Pay',
    ]],
    body: rows,
  })

  const finalY = doc.lastAutoTable.finalY + 15

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)

  doc.text(`Total Salaries: ${peso} ${formatMoney(totalSalary.value)}`, 14, finalY)
  doc.text(`Total Expenses: ${peso} ${formatMoney(totalExpenses.value)}`, 14, finalY + 8)
  doc.text(`Total Deductions: ${peso} ${formatMoney(totalDeductions.value)}`, 14, finalY + 16)

  doc.setFontSize(14)
  doc.text(`Total Net Payroll: ${peso} ${formatMoney(totalNetPay.value)}`, 14, finalY + 28)

  doc.save(`staff-payroll-${Date.now()}.pdf`)
}
</script>

<style scoped>
.icon-box {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #0d6efd;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

table th,
table td {
  vertical-align: middle;
}
</style>
