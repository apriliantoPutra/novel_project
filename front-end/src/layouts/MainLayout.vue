<template>
    <div class="min-h-screen flex flex-col bg-gray-100 text-gray-800">
        <nav class="bg-purple-600 text-white">
            <!-- dekstop -->
            <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <RouterLink to="/" class="text-2xl " >
                    <img src="/logo.png" alt="novel illustration" class="w-11 opacity-70">
                </RouterLink>
                <div class="hidden md:flex items-center space-x-6">
                    <RouterLink to="/" class="hover:text-purple-200 transition">Home</RouterLink>
                    <RouterLink to="/novels" class="hover:text-purple-200 transition">List Novel</RouterLink>
                    <template v-if="authStore.isLogin">
                        <span class="text-sm italic">Halo, {{ authStore.username }} </span>
                        <button @click="handleLogout" class="bg-purple-800 px-3 py-1 rounded-lg text-sm hover:bg-purple-900">
                            Logout
                        </button>
                    </template>
                    <template v-else>
                        <RouterLink to="/login" class="hover:text-purple-200 transition">Login</RouterLink>
                        <RouterLink to="/register" class="hover:text-purple-200 transition">Register</RouterLink>
                    </template>
                    
                </div>
                <button @click="toggleMenu" class="md:hidden ">
                    <Menu v-if="!isOpen" class="w-7 h-7"/>
                    <X v-else class="w-7 h-7" />
                </button>
            </div>
            <!-- mobile -->
            <div v-show="isOpen" class="md:hidden bg-purple-700 text-white space-y-2 px-4 py-3 animate-slide-down">
                <RouterLink @click="closeMenu" to="/" class="block hover:text-purple-300">Home</RouterLink>
                <RouterLink @click="closeMenu" to="/novels" class="block hover:text-purple-300">List Novel</RouterLink>
                <template v-if="authStore.isLogin">
                    <p class="text-sm">Halo, {{ authStore.username }} </p>
                    <button @click="handleLogout" class="w-full bg-purple-900 rounded-lg py-2 mt-2 text-sm font-medium hover:bg-purple-950 transition" >Logout</button>
                </template>
                <template v-else>
                    <RouterLink @click="closeMenu" to="/login" class="block hover:text-purple-300">Login</RouterLink>
                    <RouterLink @click="closeMenu" to="/register" class="block hover:text-purple-300">Register</RouterLink>
                </template>
                
            </div>
        </nav>
        <main class="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6">
            <RouterView/>
        </main>
        <footer class="bg-purple-700 text-white py-4 mt-auto text-center">
            <p class="text-sm">@copy; 2025 NovelApp. Semua hak cipta dilindungi</p>
        </footer>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue"
import { useRouter } from "vue-router"
import {Menu, X} from 'lucide-vue-next'
import {useAuthStore} from "../stores/auth.store"

const authStore= useAuthStore()
const isOpen= ref(false)
const toggleMenu= ()=> {
    isOpen.value= !isOpen.value
}
const closeMenu = () => {
    isOpen.value= false
}

const router= useRouter()
const handleLogout= ()=> {
    authStore.logout()
    router.push({name: "Home", query: {message: "Kamu telah logout"} })
}


</script>