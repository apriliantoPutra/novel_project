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

        <!-- Isi Novel -->
        <div  v-html="chapter.content" class="bg-white rounded-xl shadow p-6 text-gray-800 leading-relaxed text-justify space-y-4">
        </div>

        <!-- Komentar -->
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-2xl font-semibold text-purple-700 mb-4">
          💬 Komentar
        </h3>

        <!-- Form Komentar -->
        <div v-if="user" class="mb-6">
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
                    @click="updateComment(comment.id)"
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
                  v-if="user && (comment.user_id === user.id || user.role === 'admin')"
                  class="flex gap-3 mt-2"
                >
                  <button
                    @click="startEditing(comment)"
                    class="text-blue-600 text-xs hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    @click="deleteComment(comment.id)"
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
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoadingSpinner from "../../components/Loading.vue"
const API= import.meta.env.VITE_API_URL

const user= ref(null)

const chapter= ref({})
const comments= ref([])
const loading= ref(true)
const error= ref(null)
const content= ref('')

// edit
const editingId= ref(null)
const editContent= ref('')

const route= useRoute()
const router= useRouter()

onMounted(async()=> {
  const savedUser= localStorage.getItem("user")
  if(savedUser){
      user.value= JSON.parse(savedUser)
  }
  await getChapter(),
  await getComments()

})
const getChapter= async()=>{
  try {
    const id= route.params.id
    const token= localStorage.getItem("token")
    
    const res= await axios.get(`${API}/chapter/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    chapter.value= res.data.data

  } catch (err) {
    error.value= "Gagal memuat data chapter"
    console.log(err)
  } finally{
    loading.value= false
  }
}
const getComments= async()=>{
  try {
    const res= await axios.get(`${API}/comment?novel_id=${chapter.value.novel_id}&chapter_id=${chapter.value.id}`)
    comments.value= res.data.data
  } catch (err) {
    error.value= "Gagal memuat data comment"
    console.log(err)
  }
}
const handleCreate=async()=> {
  try {
    const token= localStorage.getItem("token")
    const res= await axios.post(`${API}/comment`, {
      novel_id: chapter.value.novel_id,
      chapter_id: chapter.value.id,
      content: content.value
    },{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

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
const updateComment= async(id)=> {
  try {
    const token= localStorage.getItem("token")
    await axios.put(`${API}/comment/${id}`, {
      content: editContent.value
    }, {
      headers: {Authorization: `Bearer ${token}`}
    })
    
    router.go(0)
  } catch (err) {
    error.value = err.response?.data?.error || "Gagal mengubah komentar";
  }
}
const deleteComment= async(id)=> {
   if (!confirm("Hapus komentar ini?")) return;
   try {
    const token= localStorage.getItem("token")
    await axios.delete(`${API}/comment/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    })

    router.go(0)
   } catch (err) {
      error.value = err.response?.data?.error || "Gagal menghapus komentar";
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
