<template>
    <div>
      <LoadingSpinner v-if="loading" />
      <div v-else-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>
      <template v-else>
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-purple-700 flex items-center gap-2">
            <Users class="w-6 h-6" /> Daftar Pengguna
          </h1>
          <RouterLink
            :to="{name: 'UserCreate'}"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <UserPlus class="w-5 h-5" /> Tambah User
          </RouterLink>
        </div>

        <div class="overflow-x-auto bg-white shadow-md rounded-lg">
          <table class="min-w-full text-sm text-left text-gray-600">
            <thead class="bg-purple-600 text-white">
              <tr>
                <th class="px-4 py-3">Avatar</th>
                <th class="px-4 py-3">Username</th>
                <th class="px-4 py-3">Email</th>
                <th class="px-4 py-3">Role</th>
                <th class="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody v-if="users.length > 0" >
              <tr
                v-for="(user, i) in users"
                :key="i"
                class="border-b hover:bg-purple-50"
              >
                <td class="px-4 py-3">
                  <img
                    :src="user.avatar_url || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg' "
                    class="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td class="px-4 py-3 font-semibold text-gray-800">{{ user.username }}</td>
                <td class="px-4 py-3">{{ user.email }}</td>
                <td class="px-4 py-3 capitalize">{{ user.role }}</td>
                <td class="px-4 py-3 flex justify-center gap-3">
                  <RouterLink :to="{name: 'UserDetail', params: {id: user.id} }" class="text-blue-600 hover:text-blue-800">
                    <Eye class="w-5 h-5" />
                  </RouterLink>
                  <RouterLink :to="{name: 'UserEdit', params: {id: user.id} }" class="text-green-600 hover:text-green-800">
                    <Edit class="w-5 h-5" />
                  </RouterLink>
                  <button 
                  @click="handleDelete(user.id)"
                  class="text-red-600 hover:text-red-800 cursor-pointer">
                    <Trash2 class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="4" class="text-center py-5 text-gray-500 italic">
                  Tidak ada data user
                </td>
              </tr>
          </tbody>
          </table>
        </div>
      </template>
  </div>
</template>

<script setup>
import axios from "axios"
import { Users, UserPlus, Eye, Edit, Trash2 } from "lucide-vue-next"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import LoadingSpinner from "../../../components/Loading.vue"
const API= import.meta.env.VITE_API_URL

const route= useRoute()
const router= useRouter()

const users = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(() => {
  getAllUser()
})


const getAllUser= async()=> {
  try {
    const token= localStorage.getItem("token")

    const response= await axios.get(`${API}/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    users.value= response.data.data

  } catch (err) {
    error.value= "Gagal memuat data pengguna"
    console.error(err)
  } finally {
    loading.value= false
  }
}

const handleDelete= async(id)=> {
  if (!confirm("Yakin ingin menghapus user ini?")) return

  try {
    const token= localStorage.getItem("token")

    await axios.delete(`${API}/user/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    users.value= users.value.filter((u)=> u.id !== id)
    alert("User berhasil dihapus!")

  } catch (err) {
    error.value= err.response?.data?.error || 'Gagal menghapus user'
    console.error(err)
  }
}
</script>