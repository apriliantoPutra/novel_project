<template>
  <div class="bg-white shadow-md rounded-xl p-6">
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>
    <template v-else>
      <h1 class="text-2xl font-bold text-purple-700 flex items-center gap-2 mb-6">
        <Edit class="w-6 h-6" /> Edit Novel
      </h1>

      <form class="space-y-5" @submit.prevent="handleEdit" enctype="multipart/form-data" >
        <div>
          <label class="block text-gray-700 font-medium mb-1">Judul</label>
          <input
            type="text"
            v-model="novel.title"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Sinopsis</label>
          <textarea
            rows="4"
            v-model="novel.synopsis"
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
                v-model="selectedGenreIds"
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
              <img
                v-else-if="novel.cover_url"
                :src="novel.cover_url"
                alt="Preview Cover"
                class="w-full h-full object-cover"
              />
              <Image v-else class="w-10 h-10 text-purple-600"/>
            </div>
            <input @change="handleCover" type="file" class="text-sm text-gray-600" />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Status</label>
          <select v-model="novel.status" class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none">
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="droped">Droped</option>
          </select>
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
import { Edit, Image } from "lucide-vue-next"
import { onMounted, ref } from "vue"
import LoadingSpinner from "../../../components/Loading.vue"
import { useRoute, useRouter } from "vue-router"
import {getNovelById, updateNovel} from "../../../services/novel.service"
import {getGenres} from "../../../services/genre.service"
const route= useRoute()
const router= useRouter()

const novel= ref({})
const genres= ref({})
const selectedGenreIds= ref([])

const selectedCover= ref(null) // untuk file baru
const previewCover= ref(null) // untuk preview baru
const loading= ref(true)
const error = ref(null)

const handleCover= (e)=> {
  const file= e.target.files[0]
  if(file){
    selectedCover.value= file
    previewCover.value= URL.createObjectURL(file)
  }
}

onMounted(async()=> {
  await fetchGenres(),
  await fetchNovelById()
})

const fetchGenres= async()=> {
  try {
    genres.value= await getGenres()
  } catch (err){
    error.value= "Gagal memuat data pengguna"
    console.log(err)
  } 
}
const fetchNovelById= async()=> {
  try {
    const id= route.params.id
    novel.value= await getNovelById(id)
    
    selectedGenreIds.value = novel.value.genres.map(g => g.id)
  } catch (err) {
    error.value= "Gagal memuat data novel"
    console.log(err)
  } finally{
    loading.value= false
  }
}

const handleEdit= async()=> {
  try {
    const token= localStorage.getItem("token")
    const id= route.params.id

    const formData= new FormData()
    formData.append("title", novel.value.title)
    formData.append("synopsis", novel.value.synopsis)
    formData.append("status", novel.value.status)
    selectedGenreIds.value.forEach(genreId=> {
      formData.append("genre_ids[]", genreId)
    })
    if(selectedCover.value){
      formData.append("cover", selectedCover.value)
    }
    await updateNovel(id, formData, token)
    router.push({name: "NovelAuthorList"})
  } catch (err) {
    console.log(err);
    error.value = "Gagal mengupdate novel";
  }
}
</script>
