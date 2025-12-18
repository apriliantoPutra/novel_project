<template>
  <div class="min-h-screen flex flex-col bg-gray-100 text-gray-800">
    <nav class="bg-purple-700 text-white sticky top-0 z-50">
      <div class="flex items-center justify-between px-6 py-4">
        <h1 class="text-xl font-bold">Dashboard</h1>
        <button @click="toggleSidebar" class="text-white focus:outline-none md:hidden">
          <Menu class="w-6 h-6" />
        </button>
        <div class="hidden md:block">
          <span class="text-sm">Hallo <span class="font-bold">{{ authStore.username || 'Author Web' }} </span> </span>
          <button @click="handleLogout" class="bg-purple-900 px-3 py-1.5 text-sm rounded-lg hover:bg-purple-950 transition">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="flex flex-1 relative">
      <div v-if="showSidebar" @click="toggleSidebar" class="fixed inset-0 backdrop-blur-sm bg-white/30 md:hidden"></div>
      <aside :class="[
        'fixed inset-y-0 top-16 left-0 w-64 bg-white shadow-lg p-5 transform transition-transform duration-300 md:translate-x-0',
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      ]">

        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-purple-700">Menu</h2>
          <button @click="toggleSidebar" class="md:hidden">
            <X class="w-6 h-6"/>
          </button>
        </div>
        <nav class="space-y-2">
          <RouterLink v-for="item in menuItems" :key="item.name" :to="{name: item.to}"  class="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-purple-100 hover:text-purple-700" @click="showSidebar = false" >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </RouterLink>
          <button
            @click="handleLogout"
            class="block md:hidden w-full text-left px-4 py-2 rounded-md bg-purple-700 text-white mt-4 hover:bg-purple-800 transition"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main class="flex-1 ml-0 md:ml-64 p-6 mx-auto w-full max-w-6xl">
        <RouterView/>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import {useAuthStore} from "../stores/auth.store"

const authStore= useAuthStore()
const router= useRouter()
import {Menu, X, LayoutDashboard, Users, BookOpen, Library} from "lucide-vue-next"
const showSidebar = ref(false)

function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}

const menuItems = [
  { name: "Dashboard", label: "Dashboard", icon: LayoutDashboard, to: "DashboardAuthor" },
  { name: "Novel", label: "Novel", icon: BookOpen, to: "NovelAuthorList" }
]

onMounted(()=> {
  if(!authStore.isLogin){
    router.push({
      name: "Login",
      query: { message: "Silakan login terlebih dahulu untuk mengakses dashboard." },
    })
  }
})

const handleLogout= ()=> {
  authStore.logout()

  router.push({
    name: "Home",
    query: { message: "Kamu telah logout dari Author Dashboard." },
  })
}
</script>
