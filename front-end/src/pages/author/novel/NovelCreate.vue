<template>
  <div class="bg-white shadow-md rounded-xl p-6">
    <h1 class="text-2xl font-bold text-purple-700 flex items-center gap-2 mb-6">
      <Plus class="w-6 h-6" /> Tambah Novel Baru
    </h1>
    <div v-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>

    <form class="space-y-5" @submit.prevent="handleCreate" enctype="multipart/form-data">
      <div>
        <label class="block text-gray-700 font-medium mb-1">Judul</label>
        <input
          type="text"
          v-model="title"
          placeholder="Masukkan judul novel"
          class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
        />
      </div>

      <div>
        <label class="block text-gray-700 font-medium mb-1">Sinopsis</label>
        <textarea
          rows="4"
          v-model="synopsis"
          placeholder="Masukkan sinopsis novel"
          class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
        ></textarea>
      </div>

      <div>
         <label class="block text-gray-700 font-medium mb-2">Genre</label>
         <div class="grid grid-cols-2 md:grid-cols-3 gap-3 border p-4 rounded-lg">
            <label
              v-for="genre in genres"
              :key="genre.id"
              class="flex items-center gap-2 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                :value="genre.id"
                v-model="genreIds"
                class="w-4 h-4 text-purple-600"
              />
              <span>{{ genre.name }}</span>
            </label>
          </div>  
      </div>

      <div>
        <label class="block text-gray-700 font-medium mb-1">Cover Image</label>
        <div class="flex items-center gap-3">
          <div class="w-16 h-20 flex items-center justify-center bg-purple-100 ">
            <img
              v-if="previewCover"
              :src="previewCover"
              alt="Preview Cover"
              class="w-full h-full object-cover"
            />
            <Image v-else class="w-10 h-10 text-purple-600"/>
          </div>
          <input name="cover" @change="handleCoverImage" type="file" class="text-sm text-gray-600" />
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <RouterLink
          :to="{name: 'NovelAuthorList'}"
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
import axios from "axios"
import { Plus, Image } from "lucide-vue-next"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
const API= import.meta.env.VITE_API_URL

const error= ref(null)
const router= useRouter()

const genres= ref([])
const genreIds= ref([])

const title= ref("")
const synopsis= ref("")
const cover= ref(null)
const previewCover= ref(null)

const handleCoverImage= (e)=> {
  const file= e.target.files[0]
  if (file){
    cover.value= file
    previewCover.value= URL.createObjectURL(file)
  }
}

// fetch genres
onMounted(()=> {
  getGenres()
})
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
  try {
      const token= localStorage.getItem("token")
      const formData= new FormData()

      formData.append("title", title.value)
      formData.append("synopsis",synopsis.value)
      genreIds.value.forEach((id)=> {
        formData.append("genre_ids[]", id)
      })
      if(cover.value){
        formData.append("cover", cover.value)
      }
      
      const res= await axios.post(
        `${API}/novel/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      )
      router.push({name: "NovelAuthorList"})

  } catch (err) {
    error.value= err.response?.data?.message || "Terjadi kesalahan saat membuat novel."

  }
}
</script>
