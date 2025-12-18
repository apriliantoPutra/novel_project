<template>
  <div class="max-w-5xl mx-auto ">
    <!-- Loading -->
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>

    <!-- Konten Utama -->
    <div v-else class="space-y-10">
      <!-- Judul Halaman -->
      <h1 class="text-3xl font-bold text-purple-700 text-center mb-10">
        Detail Novel
      </h1>

      <!-- Bagian Atas: Gambar & Info -->
      <div
        class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition"
      >
        <!-- Gambar -->
        <img
          :src="novel.cover_url"
          :alt="novel.title"
          class="w-full sm:w-64 h-64 sm:h-auto object-cover"
        />

        <!-- Info Novel -->
        <div class="flex flex-col justify-between p-6 flex-1">
          <div>
            <h2 class="text-3xl font-semibold text-purple-700 mb-2">
              {{ novel.title }}
            </h2>
            <p class="text-gray-600 mb-3">
              Penulis:
              <span class="font-medium text-gray-800">{{ novel.author }}</span>
            </p>

            <!-- Genre -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="(genre, gIndex) in novel.genres"
                :key="gIndex"
                :class="[
                  'text-white text-xs font-semibold px-3 py-1 rounded-full',
                  getRandomColor(),
                ]"
              >
                {{ genre.name }}
              </span>
            </div>

            <!-- Sinopsis -->
            <p class="text-gray-700 leading-relaxed text-sm sm:text-base">
              {{ novel.synopsis }}
            </p>
          </div>
        </div>
      </div>

      <!-- Daftar Chapter -->
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-2xl font-semibold text-purple-700 mb-4">
          📚 Daftar Chapter
        </h3>
        <ul v-if="novel?.chapters && novel.chapters.length"
        class="divide-y divide-gray-100">
          <li
            v-for="(ch, index) in novel.chapters"
            :key="index"
          >
            <RouterLink
              :to="{name: 'ChapterAdminDetail', params: {id: ch.id} }"
              class="py-3 flex justify-between items-center hover:bg-purple-50 px-2 rounded-md transition"
            >
              <span class="font-medium text-gray-700"
                >{{ ch.title }} </span
              >
              <span class="text-sm text-gray-500">{{ formatTimeAgo(ch.updated_at) }} </span>
            </RouterLink>
          </li>

        </ul>

        <div v-else class="text-gray-500 italic text-center py-6 border rounded-lg bg-gray-50">
          Belum ada chapter untuk novel ini.
        </div>
      </div>

      <!-- Komentar -->
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-2xl font-semibold text-purple-700 mb-4">
          💬 Komentar
        </h3>

        <!-- Form Komentar -->
        <div v-if="authStore.isLogin" class="mb-6">
          <form class="space-y-2" @submit.prevent="handleCreate">
            <textarea
              placeholder="Tulis komentar kamu..."
              class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
              rows="3"
              v-model="content"
            ></textarea>
            <button
              type="submit"
              class="bg-purple-600 text-white px-6 py-2 rounded-lg mt-3 hover:bg-purple-700 transition"
            >
              Kirim
            </button>
          </form>
        </div>

          <div
            v-if="comments && comments.length"
            class="space-y-4"
          >
            <div
              v-for="(comment, index) in comments"
              :key="index"
              class="border border-gray-100 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
            >
              <!-- Header Comment -->
              <div class="flex justify-between items-center mb-1">
                <p class="text-sm font-semibold text-gray-800">{{ comment.username }}</p>
                <p class="text-xs text-gray-500">{{ formatTimeAgo(comment.updated_at) }}</p>
              </div>

              <!-- Jika sedang edit -->
              <div v-if="editingId === comment.id" class="space-y-2">
                <textarea
                  v-model="editContent"
                  class="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  rows="3"
                ></textarea>

                <div class="flex gap-2">
                  <button
                    @click="handleEdit(comment.id)"
                    class="px-3 py-1 bg-green-600 text-white text-xs rounded"
                  >
                    Save
                  </button>

                  <button
                    @click="cancelEditing"
                    class="px-3 py-1 bg-gray-400 text-white text-xs rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <!-- Jika bukan edit mode -->
              <div v-else>
                <p class="text-sm text-gray-700 leading-relaxed">
                  {{ comment.content }}
                </p>

                <!-- Tombol Edit & Delete (hanya pemilik atau admin) -->
                <div
                  v-if="authStore.isLogin && (comment.user_id === authStore.user.id || authStore.role === 'admin')"
                  class="flex gap-3 mt-2"
                >
                  <button
                    @click="startEditing(comment)"
                    class="text-blue-600 text-xs hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    @click="handleDelete(comment.id)"
                    class="text-red-600 text-xs hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Jika tidak ada komentar -->
          <div
            v-else
            class="text-gray-500 italic text-center py-6 border rounded-lg bg-gray-50"
          >
            Belum ada komentar untuk novel ini.
          </div>
        
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import {useRoute, useRouter} from "vue-router"
import LoadingSpinner from "../../../components/Loading.vue"
import {getRandomColor, formatTimeAgo} from "../../../utils/helpers"
import {getNovelById} from "../../../services/novel.service"
import {getComments, createComment, updateComment, deleteComment} from "../../../services/comment.service"
import {useAuthStore} from "../../../stores/auth.store"

const authStore= useAuthStore()
const route= useRoute()
const router= useRouter()

// state
const novel= ref(null)
const loading = ref(true)
const error = ref(null)
const comments= ref([])
const content= ref('')

// edit
const editingId= ref(null)
const editContent= ref('')

onMounted(async()=> {
  
  await fetchNovelById()
  await fetchCommnents()
})
const fetchNovelById= async()=> {
  try {
    const id= route.params.id
    novel.value= await getNovelById(id)
  } catch (err) {
    error.value= "Gagal memuat data novel"
  } finally {
    loading.value= false
  }
}
const fetchCommnents= async()=> {
  try {
    comments.value= await getComments(novel.value.id)
  } catch {
    error.value= "Gagal memuat data comment"
  }
}

const handleCreate=async()=> {
  try {
    const token= localStorage.getItem("token")
    await createComment({
      novel_id: novel.value.id,
      content: content.value
    }, token)
    router.go(0)
  } catch (err) {
    error.value= err.response?.data?.error || 'Terjadi kesalahan saat tambah comment'
  }
}
// edit comment
const startEditing= (comment)=>{
  editingId.value= comment.id
  editContent.value= comment.content
}
const cancelEditing= ()=>{
  editingId.value= null
  editContent.value= ''
}
const handleEdit= async(id)=> {
  try {
    const token= localStorage.getItem("token")
    await updateComment(id, {
      content: editContent.value
    }, token)
    router.go(0)
  } catch (err) {
    error.value = err.response?.data?.error || "Gagal mengubah komentar";
  }
}
const handleDelete= async(id)=> {
   if (!confirm("Hapus komentar ini?")) return;
   try {
    const token= localStorage.getItem("token")
    await deleteComment(id, token)
    router.go(0)
   } catch (err) {
      error.value = err.response?.data?.error || "Gagal menghapus komentar";
   }
}

</script>
