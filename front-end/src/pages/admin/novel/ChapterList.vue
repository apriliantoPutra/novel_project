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
import {formatTimeAgo} from "../../../utils/helpers"
import {getChaptersByNovelId, deleteChapter} from "../../../services/chapter.service"

const route= useRoute()
const router= useRouter()
const novelId= route.params.novelId

const chapters= ref([])
const loading= ref(true)
const error= ref(null)

onMounted(()=>{
  fetchChapters()
})
const fetchChapters= async()=>{
  try {
    chapters.value= await getChaptersByNovelId(novelId)
    
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
    await deleteChapter(id, token)

    router.go(0)
  } catch {
    error.value= "Gagal menghapus data novel"
  }
}


</script>
