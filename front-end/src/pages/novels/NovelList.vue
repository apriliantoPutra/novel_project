<template>
  <div class="p-4 sm:p-6">
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>

    <div v-else>
      <h1 class="text-4xl font-bold text-purple-700 mb-6 text-center">Daftar Novel</h1>
      <div class="space-y-6" v-if="novels.length">
        <NovelCard v-for="novel in novels" :key="novel.id" :novel="novel" />
      </div>

      <!-- jika kosong -->
      <div v-else class="text-center text-gray-500 italic mt-8">
        Belum ada novel yang tersedia.
      </div>
    </div>

    
  </div>
</template>

<script setup>
import NovelCard from "../../components/NovelCard.vue"
import LoadingSpinner from "../../components/Loading.vue"
const API= import.meta.env.VITE_API_URL

import { ref, onMounted } from "vue";
import axios from "axios"

const novels = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async()=> {
  try {
    const response= await axios.get(`${API}/novel`)
    novels.value= response.data.data

  } catch (err) {
    error.value= "Gagal memuat data"
    console.error(err)
  } finally {
    loading.value= false
  }
})

</script>
