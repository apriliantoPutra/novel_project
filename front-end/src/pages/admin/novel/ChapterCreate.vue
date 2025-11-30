<template>
  <div class="bg-white shadow-md rounded-xl p-6">
    <h1 class="text-2xl font-bold text-purple-700 flex items-center gap-2 mb-6">
      <Plus class="w-6 h-6" /> Tambah Chapter
    </h1>
    <div v-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>

    <form class="space-y-5" @submit.prevent="handleCreate" >
      <div>
        <label class="block text-gray-700 font-medium mb-1">Judul Chapter</label>
        <input
          type="text"
          v-model="title"
          placeholder="Masukkan judul chapter"
          class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
        />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-1">Nomor Chapter</label>
        <input
          type="number"
          v-model="chapter_number"
          placeholder="Masukkan nomor chapter"
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
          :to="{name: 'ChapterAdminList', params:{novelId: novelId } }"
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Batal
        </RouterLink>
        <button
          type="submit"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
        >
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { Plus } from "lucide-vue-next"
import { QuillEditor } from "@vueup/vue-quill"
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import { useRoute, useRouter } from "vue-router"
import { ref } from "vue"
import axios from "axios"
const API= import.meta.env.VITE_API_URL

const route= useRoute()
const router= useRouter()

const title= ref('')
const content= ref(null)
const chapter_number= ref('')
const novelId= route.params.novelId
const error= ref(null)

const handleCreate= async()=>{
  try {
    const token= localStorage.getItem("token")
    const res= await axios.post(`${API}/novel/${novelId}/chapter`,{
      title: title.value,
      content: content.value,
      chapter_number: Number(chapter_number.value)
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    router.push({name: 'ChapterAdminList', params:{novelId: novelId } })
    
  } catch (err) {
    error.value= err.response?.data?.error || 'Terjadi kesalahan saat tambah chapter'
  }
}
</script>
