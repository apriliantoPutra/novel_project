<template>
  <div class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
    <h1 class="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
      <UserPlus class="w-6 h-6" /> Tambah Pengguna Baru
    </h1>

    <form class="space-y-5" @submit.prevent="handleCreate" enctype="multipart/form-data">
      <!-- Avatar Upload -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Avatar</label>
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full">
            <img
              v-if="previewAvatar"
              :src="previewAvatar"
              alt="Preview Avatar"
              class="w-full h-full object-cover"
            />
            <UserCircle v-else class="w-10 h-10 text-purple-600"/>
          </div>
          <input @change="handleAvatarImage" type="file" class="text-sm text-gray-500" />
        </div>
      </div>

      <!-- Username -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Username</label>
        <input
          type="text"
          v-model="username"
          class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          placeholder="Masukkan username"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Email</label>
        <input
          type="email"
          v-model="email"
          class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          placeholder="Masukkan email"
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Password</label>
        <input
          type="password"
          v-model="password"
          class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          placeholder="Masukkan password"
        />
      </div>

      <!-- Role -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Role</label>
        <select
          class="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          v-model="role"
        >
          <option selected value="reader">Reader</option>
          <option value="author">Author</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button
        type="submit"
        class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md font-medium"
      >
        Simpan
      </button>
    </form>
  </div>
</template>

<script setup>
import { UserPlus, UserCircle } from "lucide-vue-next"
import axios from "axios"
import { ref } from "vue"
import { useRouter } from "vue-router"

const error= ref(null)
const router= useRouter()
const API= import.meta.env.VITE_API_URL

const username= ref('')
const email= ref('')
const password= ref('')
const role= ref('reader')
const avatar= ref(null)
const previewAvatar= ref(null)

const handleAvatarImage= (e)=> {
  const file= e.target.files[0]
  if (file){
    avatar.value= file
    previewAvatar.value= URL.createObjectURL(file)
  }
}

const handleCreate= async()=> {
  try {
    const token= localStorage.getItem("token")

    const formData= new FormData()
    formData.append("username", username.value)
    formData.append("email", email.value)
    formData.append("password", password.value)
    formData.append("role", role.value)
    if(avatar.value){
      formData.append("avatar", avatar.value)
    }
    
    const res = await axios.post(
      `${API}/user/create`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    )

    
     router.push({name: 'UserList'}) 
    
  } catch (err) {
     error.value= err.response?.data?.error || 'Buat akun user gagal!'
  }

}
</script>
