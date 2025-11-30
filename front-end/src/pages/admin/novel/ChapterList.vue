<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>
    <template v-else>
      <div  class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-purple-700 flex items-center gap-2">
          <List class="w-6 h-6" /> Daftar Chapter
        </h1>
        <RouterLink
          :to="{name: 'ChapterAdminCreate', params: {novelId: novelId } }"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus class="w-5 h-5" /> Tambah Chapter
        </RouterLink>
      </div>

      <div class="overflow-x-auto bg-white shadow-md rounded-xl">
        <table class="min-w-full text-sm text-left text-gray-600">
          <thead class="bg-purple-600 text-white">
            <tr>
              <th class="px-4 py-3">Chapter Nomor</th>
              <th class="px-4 py-3">Judul</th>
              <th class="px-4 py-3">Tanggal</th>
              <th class="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody v-if="chapters.length > 0" >
            <tr
              v-for="(chapter, i) in chapters"
              :key="i"
              class="border-b hover:bg-purple-50 transition"
            >
              <td class="px-4 py-3 font-medium text-gray-800">
                {{ chapter.chapter_number }}
              </td>
              <td class="px-4 py-3">{{ chapter.title }}</td>
              <td class="px-4 py-3">{{ formatTimeAgo(chapter.updated_at) }}</td>
              <td class="px-4 py-3 flex justify-center gap-3">
                <RouterLink :to="{name: 'ChapterAdminDetail', params: {id: chapter.id} }" class="text-blue-600 hover:text-blue-800">
                  <Eye class="w-5 h-5" />
                </RouterLink>

                <RouterLink :to="{name: 'ChapterAdminEdit', params: {id: chapter.id} }" class="text-green-600 hover:text-green-800">
                  <Edit class="w-5 h-5" />
                </RouterLink>

                <button @click="handleDelete(chapter.id)" class="text-red-600 hover:text-red-800">
                  <Trash2 class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
              <tr>
                <td colspan="4" class="text-center py-5 text-gray-500 italic">
                  Tidak ada data chapter
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
import LoadingSpinner from "../../../components/Loading.vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"
const API= import.meta.env.VITE_API_URL

const route= useRoute()
const router= useRouter()
const novelId= route.params.novelId

const chapters= ref([])
const loading= ref(true)
const error= ref(null)

onMounted(()=>{
  getChapters()
})
const getChapters= async()=>{
  try {
    const res= await axios.get(`${API}/novel/${novelId}/chapters`)
    chapters.value= res.data.data
    
  } catch (err) {
    error.value= "Gagal memuat data novel"
    console.log(err)
  } finally{
    loading.value= false
  }
}
const handleDelete= async(id)=>{
  try {
    if (!confirm("Yakin ingin menghapus chapter ini?")) return

    const token= localStorage.getItem("token")
    const res= await axios.delete(`${API}/chapter/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    router.go(0)
  } catch {
    error.value= "Gagal menghapus data novel"
  }
}

function formatTimeAgo(dateString){
  const date= new Date(dateString)
  const now = new Date()
  const diffMs= now - date
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
}
</script>
