<template>
  <div class="max-w-3xl mx-auto px-4 py-10 space-y-10">
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>
    <template v-else>
        <div class="text-center">
          <h1 class="text-3xl font-bold text-purple-700 mb-2">
            Chapter {{ chapter.chapter_number }}: {{ chapter.title }}
          </h1>
          <p class="text-gray-500 text-sm">Updated at {{ formatTimeAgo(chapter.updated_at) }}</p>
        </div>
        <ButtonChapter
          :hasPrevChapter="hasPrevChapter"
          :hasNextChapter="hasNextChapter"
          :prevChapterId="prevChapterId"
          :nextChapterId="nextChapterId"
        />
        <!-- Isi Novel -->
        <div  v-html="chapter.content" class="bg-white rounded-xl mb-8 shadow p-6 text-gray-800 leading-relaxed text-justify space-y-4">
        </div>
        <ButtonChapter
          :hasPrevChapter="hasPrevChapter"
          :hasNextChapter="hasNextChapter"
          :prevChapterId="prevChapterId"
          :nextChapterId="nextChapterId"
        />
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

    </template>
  </div>
</template>

<script setup>
import ButtonChapter from "../../components/ButtonChapter.vue"
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoadingSpinner from "../../components/Loading.vue"
import { formatTimeAgo } from "../../utils/helpers";
import {getChaptersByNovelId, getChapterById} from "../../services/chapter.service"
import {getCommentsByChapter, createComment, updateComment, deleteComment} from "../../services/comment.service"
import {useAuthStore} from "../../stores/auth.store"

// state
const authStore= useAuthStore()
const chapter= ref({})

const chapters= ref([])
const comments= ref([])
const loading= ref(true)
const error= ref(null)
const content= ref('')

// edit
const editingId= ref(null)
const editContent= ref('')

const route= useRoute()
const router= useRouter()

const loadData= async()=> {
  try {
    loading.value = true
    error.value = null

    const id= route.params.id
    const token = localStorage.getItem("token")

    // fetch chapter detail
    chapter.value= await getChapterById(id, token)
    // fetch semua chapter pada novel ini
    const novelId = chapter.value.novel_id
    chapters.value = await getChaptersByNovelId(novelId)
    // fetch comments
    comments.value = await getCommentsByChapter(chapter.value.novel_id, chapter.value.id)
    
  }  catch (err) {
    error.value = err.response?.data?.error || "Gagal memuat data chapter"
  } finally {
    loading.value = false
  }
}

onMounted(async()=> {
 await loadData()
})

watch(
  ()=> route.params.id,
  async(newId, oldId)=> {
    if (newId !== oldId) {
      await loadData() // Muat ulang data
    }
  }
)


const handleCreate=async()=> {
  try {
    const token= localStorage.getItem("token")
    await createComment({
      novel_id: chapter.value.novel_id,
      chapter_id: chapter.value.id,
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

// navigasi chapter
const hasPrevChapter= computed(()=> {
  return chapter.value.chapter_number > 1
})
const hasNextChapter= computed(()=> {
  return chapter.value.chapter_number < chapters.value.length
})
const prevChapterId= computed(()=> {
  if(!hasPrevChapter.value) return null
  const currentIndex= chapters.value.findIndex(
    chap => chap.chapter_number === chapter.value.chapter_number
  )
  if(currentIndex > 0){
    return chapters.value[currentIndex -1].id
  }
  return null
})
const nextChapterId= computed(()=> {
  if(!hasNextChapter.value) return null
  const currentIndex= chapters.value.findIndex(
    chap => chap.chapter_number === chapter.value.chapter_number
  )
  if(currentIndex < chapters.value.length -1){
    return chapters.value[currentIndex +1].id
  }
  return null
})


</script>
