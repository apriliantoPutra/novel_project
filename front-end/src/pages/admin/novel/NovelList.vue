<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>
    <template v-else>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-purple-700 flex items-center gap-2">
        <BookOpen class="w-6 h-6" /> Daftar Novel
      </h1>
      <RouterLink
        :to="{name: 'NovelAdminCreate'}"
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <Plus class="w-5 h-5" /> Tambah Novel
      </RouterLink>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white shadow-md rounded-xl">
      <table class="min-w-full text-sm text-left text-gray-600">
        <thead class="bg-purple-600 text-white">
          <tr>
            <th class="px-4 py-3">Cover</th>
            <th class="px-4 py-3">Judul</th>
            <th class="px-4 py-3">Author</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Total Chapter</th>
            <th class="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody v-if="novels.length > 0" >
          <tr
            v-for="(novel, i) in novels"
            :key="i"
            class="border-b hover:bg-purple-50 transition"
          >
            <td class="px-4 py-3">
              <img
                :src="novel.cover_url || 'https://i.pinimg.com/736x/dc/0a/72/dc0a724fcd5fcec5a49c2c53f3e52b5d.jpg'"
                class="w-14 h-20 rounded-md object-cover"
              />
            </td>
            <td class="px-4 py-3 font-medium text-gray-800">{{ novel.title }}</td>
            <td class="px-4 py-3">{{ novel.author }}</td>
            <td class="px-4 py-3">{{ novel.status }}</td>
            <td class="px-4 py-3 ">{{ novel.total_chapters || 0 }}</td>
            <td class="px-4 py-3 flex justify-center gap-3">
              <RouterLink
                :to="{name: 'NovelAdminDetail', params:{id: novel.id } }"
                class="text-blue-600 hover:text-blue-800"
              >
                <Eye class="w-5 h-5" />
              </RouterLink>
              <RouterLink
                :to="{name: 'NovelAdminEdit', params:{id: novel.id} }"
                class="text-green-600 hover:text-green-800"
              >
                <Edit class="w-5 h-5" />
              </RouterLink>
              <button @click="handleDelete(novel.id)" class="text-red-600 hover:text-red-800">
                <Trash2 class="w-5 h-5" />
              </button>
              <RouterLink 
              :to="{name: 'ChapterAdminList', params: {novelId: novel.id } }"
              class="text-purple-600 hover:text-purple-800">
                <List class="w-5 h-5" />
              </RouterLink>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="text-center py-5 text-gray-500 italic">
              Tidak ada data novel
           </td>
          </tr>
        </tbody>
      </table>
    </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { BookOpen, Plus, Eye, Edit, Trash2, List } from "lucide-vue-next"
import axios from "axios"
import LoadingSpinner from "../../../components/Loading.vue"
import { useRouter } from "vue-router"
const API= import.meta.env.VITE_API_URL

const router= useRouter()

// data state
const novels = ref([])
const loading= ref(true)
const error= ref(null)

onMounted(()=> {
  getNovels()
})

// fetch novels
const getNovels= async()=> {
  try {
    const res= await axios.get(`${API}/novel`)
    novels.value= res.data.data

  } catch (err) {
    error.value= "Gagal memuat data novel"
    console.log(err)
  } finally {
    loading.value= false
  }
}
const handleDelete= async(id)=> {
  try {
    if (!confirm("Yakin ingin menghapus novel ini?")) return
    const token= localStorage.getItem("token")

    await axios.delete(`${API}/novel/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
     router.go(0)

  } catch (err) {
    err.value= "Gagal menghapus novel"
    console.log(err)
  }
}

</script>
