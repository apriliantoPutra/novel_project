<template>
  <div class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
    <div v-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>
    <template v-else>
      <h1 class="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
        <Edit class="w-6 h-6" /> Edit Pengguna
      </h1>

      <form class="space-y-5" @submit.prevent="handleUpdate" enctype="multipart/form-data">
        <div class="flex items-center gap-4">
          <img :src="previewAvatar || user.avatar_url || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg' " class="w-16 h-16 rounded-full object-cover" />
          <input type="file" @change="handleAvatarImage" class="text-sm text-gray-500" />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Username</label>
          <input
            type="text"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            v-model="user.username"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            v-model="user.email"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Role</label>
          <select
            v-model="user.role"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          >
            <option >author</option>
            <option>reader</option>
            <option>admin</option>
          </select>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Password Baru</label>
          <input
            type="password"
            v-model="newPassword"
            class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            placeholder="Kosongkan jika tidak ingin ubah password"
          />
        </div>

        <button
          type="submit"
          class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md font-medium"
        >
          Simpan Perubahan
        </button>
      </form>
    </template>
  </div>
</template>

<script setup>
import axios from "axios"
import { Edit } from "lucide-vue-next"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
const API= import.meta.env.VITE_API_URL

const route= useRoute()
const router= useRouter()

const user = ref({})
const error = ref(null)
const avatar= ref(null)
const previewAvatar= ref(null)
const newPassword= ref('')

onMounted(async()=> {
  try {
    const id= route.params.id
    const token= localStorage.getItem("token")

    const res= await axios.get(`${API}/user/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    user.value= res.data.data

  } catch (err) {
    error.value= "Gagal memuat data pengguna"
    console.error(err)
  }
}) 

const handleAvatarImage= (e)=> {
  const file= e.target.files[0]
  if (file){
    avatar.value= file
    previewAvatar.value= URL.createObjectURL(file)
  }
}

const handleUpdate = async () => {
  try {
    const token = localStorage.getItem("token")
    const id = route.params.id

    const formData = new FormData()
    formData.append("username", user.value.username)
    formData.append("email", user.value.email)
    formData.append("role", user.value.role)

    if (newPassword.value) formData.append("password", newPassword.value)
    if (avatar.value) formData.append("avatar", avatar.value)

    await axios.put(`${API}/user/edit/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    })

    router.push({ name: "UserList" })
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.error || "Gagal memperbarui data pengguna"
  }
}
</script>
