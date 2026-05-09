<template>
  <span><h4 class="mb-3 fw-bold">Cabin</h4></span>

  <div class="container-fluid py-4 px-4">
    <div class="row">

      <!-- LEFT -->
      <div class="col-md-8">
        <div class="card shadow-sm border-0 rounded-4 p-4">

          <div class="d-flex justify-content-between mb-3">
            <h5 class="fw-bold">Cabins List</h5>

            <input
              v-model="search"
              class="form-control form-control-sm"
              style="max-width: 250px"
              placeholder="Search room"
            />
          </div>

          <table class="table align-middle">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Pax</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="room in filteredRooms" :key="room.id">
                <td>
                  <img
                    :src="getImage(room.image)"
                    style="width:70px;height:55px;object-fit:cover;border-radius:8px"
                  />
                </td>

                <td>{{ room.name }}</td>
                <td>₱ {{ room.price }}</td>
                <td>{{ room.max_pax }}</td>

                <td>
                  <span class="badge" :class="room.available ? 'bg-success' : 'bg-secondary'">
                    {{ room.available ? 'Available' : 'Maintenance' }}
                  </span>
                </td>

                <td>
                  <div class="d-flex gap-2">

                    <button
                      class="btn btn-sm btn-warning d-flex align-items-center gap-1 px-3"
                      @click="editRoom(room)"
                    >
                      <Icon name="mdi:pencil" />
                      Edit
                    </button>

                    <button
                      class="btn btn-sm btn-danger d-flex align-items-center gap-1 px-3"
                      @click="deleteRoom(room.id)"
                    >
                      <Icon name="mdi:delete" />
                      Delete
                    </button>

                  </div>
                </td>
              </tr>

              <tr v-if="filteredRooms.length === 0">
                <td colspan="6" class="text-center text-muted">
                  No rooms found
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

      <!-- RIGHT -->
      <div class="col-md-4">
        <div class="card shadow-sm border-0 rounded-4 p-4">

          <h5 class="fw-bold mb-3">
            {{ isEdit ? "Edit Room" : "Add Room" }}
          </h5>

          <input v-model="form.name" class="form-control mb-2" placeholder="Name" />
          <input v-model="form.price" type="number" class="form-control mb-2" placeholder="Price" />
          <input v-model="form.max_pax" type="number" class="form-control mb-2" placeholder="Max Pax" />

          <input type="file" class="form-control mb-2" @change="handleImageUpload" />

          <div v-if="form.image" class="mb-2">
            <img :src="form.image" style="width:100%;height:120px;object-fit:cover" />
          </div>

          <button
            class="btn btn-primary w-100"
            :disabled="loading"
            @click="saveRoom"
          >
            {{ loading ? 'Saving...' : (isEdit ? "Update Room" : "Create Room") }}
          </button>

          <button
            v-if="isEdit"
            class="btn btn-secondary w-100 mt-2"
            @click="resetForm"
          >
            Cancel
          </button>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

definePageMeta({ layout: 'admin' })

const { $api } = useNuxtApp()
const toast = useToast() // ✅ CORRECT WAY

/* STATE */
const rooms = ref([])
const search = ref('')
const isEdit = ref(false)
const loading = ref(false)

const form = ref({
  id: null,
  name: '',
  price: '',
  max_pax: '',
  file: null,
  image: '',
  available: true
})

/* FETCH */
const fetchRooms = async () => {
  try {
    const res = await $api('/rooms')
    rooms.value = res.data || res
  } catch (err) {
    handleError(err)
  }
}

onMounted(fetchRooms)

/* IMAGE */
const getImage = (img) => {
  if (!img) return 'https://via.placeholder.com/70'
  if (img.startsWith('blob')) return img
  return `http://127.0.0.1:8000/storage/${img}`
}

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  form.value.file = file
  form.value.image = URL.createObjectURL(file)
}

/* FILTER */
const filteredRooms = computed(() =>
  rooms.value.filter(r =>
    r.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

/* SAVE */
const saveRoom = async () => {
  loading.value = true

  try {
    const formData = new FormData()

    formData.append('name', form.value.name)
    formData.append('price', form.value.price)
    formData.append('max_pax', form.value.max_pax)

    // ✅ FIX BOOLEAN
    formData.append('available', form.value.available ? 1 : 0)

    if (form.value.file) {
      formData.append('image', form.value.file)
    }

    if (isEdit.value) {
      formData.append('_method', 'PUT')

      await $api(`/rooms/${form.value.id}`, {
        method: 'POST',
        body: formData
      })

      toast.success('Room updated successfully ✅')
    } else {
      await $api('/rooms', {
        method: 'POST',
        body: formData
      })

      toast.success('Room created successfully ✅')
    }

    await fetchRooms()
    resetForm()

  } catch (err) {
    handleError(err)
  }

  loading.value = false
}

/* EDIT */
const editRoom = (room) => {
  isEdit.value = true
  form.value = {
    ...room,
    image: getImage(room.image),
    file: null
  }
}

/* DELETE */
const deleteRoom = async (id) => {
  if (!confirm('Are you sure?')) return

  try {
    await $api(`/rooms/${id}`, { method: 'DELETE' })

    toast.success('Room deleted 🗑️')
    fetchRooms()

  } catch (err) {
    handleError(err)
  }
}

/* RESET */
const resetForm = () => {
  isEdit.value = false
  form.value = {
    id: null,
    name: '',
    price: '',
    max_pax: '',
    file: null,
    image: '',
    available: true
  }
}

/* ERROR HANDLER */
const handleError = (err) => {
  console.error('🔥 BACKEND ERROR:', err)

  if (err?.data?.message) {
    toast.error(err.data.message)
    return
  }

  if (err?.data?.errors) {
    Object.values(err.data.errors).forEach(errors => {
      errors.forEach(msg => toast.error(msg))
    })
    return
  }

  toast.error('Something went wrong ❌')
}
</script>

<style scoped>
.table td {
  vertical-align: middle;
}

.btn {
  border-radius: 8px;
}
</style>