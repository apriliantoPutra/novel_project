<template>
  <div class="bg-white shadow-md rounded-xl p-6">
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>
    <template v-else>
      <h1 class="text-2xl font-bold text-purple-700 flex items-center gap-2 mb-6">
        <Edit class="w-6 h-6" /> Edit Chapter
      </h1>

      <form class="space-y-5" @submit.prevent="handleEdit">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Judul Chapter</label>
          <input
            type="text"
            v-model="chapter.title"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Nomor Chapter</label>
          <input
            type="number"
            v-model="chapter.chapter_number"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Isi Chapter</label>
          <QuillEditor
            theme="snow"
            :content="content"
            @update:content="val => content = val"
            contentType="html"
            class="bg-white border rounded-md min-h-[250px]"
          />

        </div>

        <div class="flex justify-end gap-3">
          <RouterLink
            :to="novelId ? { name: 'ChapterAuthorList', params: { novelId } } : ''"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Batal
          </RouterLink>
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { Edit } from "lucide-vue-next"
import { QuillEditor } from "@vueup/vue-quill"
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import LoadingSpinner from "../../../components/Loading.vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"
const route= useRoute()
const router= useRouter()
const API= import.meta.env.VITE_API_URL

const chapter= ref({})
const content= ref('')
const loading= ref(true)
const error= ref(null)
const novelId = ref(null)
onMounted(()=> {
  getChapter()

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
    content.value= chapter.value.content
    novelId.value = chapter.value.novel_id

  } catch (err) {
    error.value= "Gagal memuat data chapter"
    console.log(err)
  } finally{
    loading.value= false
  }
}
const handleEdit= async()=>{
  try {
    const id= route.params.id
    const token= localStorage.getItem("token")
    const res= await axios.put(`${API}/chapter/${id}`,{
      title: chapter.value.title,
      content: content.value,
      chapter_number: Number(chapter.value.chapter_number)
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    router.push({name: 'ChapterAuthorList', params:{novelId: novelId.value } })
    
  } catch (err) {
    error.value= err.response?.data?.error || 'Terjadi kesalahan saat tambah chapter'
  }
}
</script>
