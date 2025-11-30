<template>
  <div class="min-h-screen flex flex-col bg-gray-100 text-gray-800">
    <!-- Navbar -->
    <nav class="bg-purple-700 text-white shadow-md sticky top-0 z-50">
      <div class="flex items-center justify-between px-6 py-4">
        <h1 class="text-xl font-bold tracking-wide">Admin Dashboard</h1>

        <!-- Toggle Button (Mobile Only) -->
        <button @click="toggleSidebar" class="text-white focus:outline-none md:hidden">
          <Menu class="w-6 h-6" />
        </button>

        <!-- Right: Profile -->
        <div class="hidden md:block">
          <span class="text-sm">Halo, <span class="font-semibold">{{ user?.username || 'Admin Web' }} 👋</span></span>
          <button @click="handleLogout"
          class="bg-purple-900 px-3 py-1.5 text-sm rounded-lg hover:bg-purple-950 transition">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Layout Container -->
    <div class="flex flex-1 relative">
      <!-- Overlay (Mobile Only) -->
      <div
        v-if="showSidebar"
        @click="toggleSidebar"
        class="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
      ></div>

      <!-- Sidebar -->
      <aside
        :class="[
          'bg-white shadow-lg w-64 p-5 space-y-3 fixed inset-y-0 left-0 transform transition-transform duration-300 z-40',
          showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ]"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-purple-700">Menu</h2>
          <button
            @click="toggleSidebar"
            class="md:hidden text-gray-500 hover:text-purple-600 transition"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Sidebar Menu -->
        <nav class="space-y-2">
          <RouterLink
            v-for="item in menuItems"
            :key="item.name"
            @click="setActiveMenu(item.name)"
            class="w-full text-left px-4 py-2 rounded-md flex items-center gap-3 transition font-medium"
            :class="[
              activeMenu === item.name
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
            ]"
            :to="{name: item.to}"
          >
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

      <!-- Main Content -->
      <main class="flex-1 ml-0 md:ml-64 p-6 transition-all duration-300 mx-auto w-full max-w-6xl">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  BookOpen,
  Library
} from "lucide-vue-next"

import { useRouter } from "vue-router"

const router= useRouter()
const user= ref(null)

const showSidebar = ref(false)
const activeMenu = ref("Dashboard")

function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}

function setActiveMenu(name) {
  activeMenu.value = name
  showSidebar.value = false
}

const menuItems = [
  { name: "Dashboard", label: "Dashboard", icon: LayoutDashboard, to: "DashboardAdmin" },
  { name: "User", label: "User", icon: Users, to: "UserList" },
  { name: "Genre", label: "Genre", icon: Library, to: "Genre" },
  { name: "Novel", label: "Novel", icon: BookOpen, to: "NovelAdminList" }
]

onMounted(()=> {
  const savedUser = localStorage.getItem("user")
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  } else {
    // Kalau tidak ada user, kembalikan ke login
    router.push({
      name: "Login",
      query: { message: "Silakan login terlebih dahulu untuk mengakses dashboard." },
    })
  }
})

const handleLogout= ()=> {
  localStorage.removeItem("token")
  localStorage.removeItem("user")

  router.push({
    name: "Home",
    query: { message: "Kamu telah logout dari Admin Dashboard." },
  })
}

</script>
