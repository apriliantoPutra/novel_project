<template>
  <div class="p-4 sm:p-6">
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>

    <template v-else>
      <h1 class="text-4xl font-bold text-purple-700 mb-6 text-center">Daftar Novel</h1>
      <div class="space-y-6" v-if="novels.length">
        <NovelCard v-for="novel in novels" :key="novel.id" :novel="novel" />
      </div>

      <!-- jika kosong -->
      <div v-else class="text-center text-gray-500 italic mt-8">
        Belum ada novel yang tersedia.
      </div>
    </template>

  </div>
</template>

<script setup>
import NovelCard from "../../components/NovelCard.vue"
import LoadingSpinner from "../../components/Loading.vue"
import { ref, onMounted } from "vue";
import {getNovels} from "../../services/novel.service"

// state
const novels = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async()=>{
  try {
    novels.value = await getNovels()
  } catch {
    error.value= "Gagal memuat daftar novel."
  } finally{
    loading.value= false
  }
})
</script>
