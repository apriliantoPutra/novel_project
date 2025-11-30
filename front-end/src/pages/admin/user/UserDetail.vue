<template>
  <div class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>
    <template v-else>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-purple-700 flex items-center gap-2">
          <User class="w-6 h-6" /> Detail Pengguna
        </h1>
        <RouterLink
          :to="{name: 'UserEdit'}"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Edit class="w-5 h-5" /> Edit
        </RouterLink>
      </div>

      <div class="flex flex-col sm:flex-row gap-6 items-start">
        <img
          :src="user.avatar_url || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg' "
          class="w-32 h-32 rounded-full object-cover"
        />

        <div class="space-y-3">
          <p><span class="font-semibold text-gray-700">Username: </span>{{ user.username }} </p>
          <p><span class="font-semibold text-gray-700">Email: </span>{{ user.email }} </p>
          <p><span class="font-semibold text-gray-700 ">Role: </span  >{{ user.role }} </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { User, Edit } from "lucide-vue-next"
import axios from "axios"
import { onMounted, ref } from "vue"
import LoadingSpinner from "../../../components/Loading.vue"
import { useRoute } from "vue-router"
const API= import.meta.env.VITE_API_URL

const route= useRoute()

const user = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async()=> {
  try {
    const token= localStorage.getItem("token")
    const id= route.params.id

    const response= await axios.get(`${API}/user/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    user.value= response.data.data

  } catch (err) {
    error.value= "Gagal memuat data pengguna"
    console.error(err)
  } finally {
    loading.value= false
  }
})
</script>
