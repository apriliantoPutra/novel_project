<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>
    <template v-else>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-purple-700 flex items-center gap-2">
        <BookOpen class="w-6 h-6" /> Daftar Genre
      </h1>

      <button
        @click="openCreateModal"
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <Plus class="w-5 h-5" /> Tambah Genre
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white shadow-md rounded-xl">
      <table class="min-w-full text-sm text-left text-gray-600">
        <thead class="bg-purple-600 text-white">
          <tr>
            <th class="px-4 py-3">Nama Genre</th>
            <th class="px-4 py-3">Deskripsi</th>
            <th class="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(genre, i) in genres"
            :key="i"
            class="border-b hover:bg-purple-50 transition"
          >
            <td class="px-4 py-3 font-medium text-gray-800">{{ genre.name }}</td>
            <td class="px-4 py-3">{{ genre.description }}</td>
            <td class="px-4 py-3 flex justify-center gap-3">
              
              <button @click="handleDelete(genre.id)" class="text-red-600 hover:text-red-800">
                <Trash2 class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Create -->
    <div
      v-if="showCreate"
      class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn"
      >
        <button
          @click="closeCreateModal"
          class="absolute top-3 right-3 text-gray-400 hover:text-purple-600"
        >
          <X class="w-5 h-5" />
        </button>

        <h2 class="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
          <Plus class="w-5 h-5" /> Tambah Genre
        </h2>

        <form class="space-y-4" @submit.prevent="handleCreate">
          <div>
            <label class="block text-gray-700 font-medium mb-1">Nama Genre</label>
            <input
              type="text"
              v-model="name"
              placeholder="Masukkan nama genre"
              class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1">Deskripsi</label>
            <textarea
              v-model="description"
              placeholder="Masukkan deskripsi"
              class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeCreateModal"
              class="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>

    
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { BookOpen, Plus, Trash2, X } from "lucide-vue-next"
import axios from "axios"
import { useRouter } from "vue-router"
import LoadingSpinner from "../../components/Loading.vue"
const API= import.meta.env.VITE_API_URL

const router= useRouter()

// data state
const genres = ref([])
const loading= ref(true)
const error= ref(null)
const selectedGenre = ref({})

// values for form
const name= ref('')
const description= ref('')

// modal state
const showCreate = ref(false)


//  methods to open/close modals
function openCreateModal() {
  showCreate.value = true
}
function closeCreateModal() {
  showCreate.value = false
}

onMounted(()=> {
  getGenres()
})

//  fetch API genres
const getGenres= async()=> {
  try {
    const res= await axios.get(`${API}/genre`)
    genres.value= res.data.data
  } catch (err){
    error.value= "Gagal memuat data pengguna"
    console.log(err)
  } finally{
    loading.value= false
  }
}
const handleCreate= async()=> {
  const token= localStorage.getItem("token")
  try {
    const res= await axios.post(`${API}/genre/create`, {
      name: name.value,
      description: description.value
    },{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    router.go(0)


  } catch (err) {
    error.value= "Gagal membuat genre"
    console.log(err)
  } finally{
    closeCreateModal()
  }
}
const handleDelete= async(id)=> {
  if (!confirm("Yakin ingin menghapus genre ini?")) return
  
  const token= localStorage.getItem("token")
  try {
    const res= await axios.delete(`${API}/genre/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    router.go(0)


  } catch (err) {
    error.value= "Gagal menghapus genre"
    console.log(err)
  }
}

</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
</style>
