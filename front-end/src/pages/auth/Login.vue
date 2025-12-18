<template>
    <div class="min-h-screen flex items-center justify-center bg-purple-300">
        <div class="bg-white rounded-2xl shadow-2xl py-8 px-4 w-full max-w-md">
            <RouterLink to="/" class="flex justify-center mb-2" >
                <img src="/logo.png" alt="novel illustration" class="w-11 opacity-70">
            </RouterLink>
            <h1 class="text-3xl font-bold text-purple-700 text-center mb-2">Login</h1>
            <form class="space-y-4" @submit.prevent="handleLogin">
                <p v-if="message" class="text-purple-500 text-sm text-center mt-2">{{ message }}</p>
                <p v-if="error" class="text-red-500 text-sm text-center mt-2">{{ error }}</p>
                <div>
                     <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        v-model="username"
                        placeholder="Masukkan username"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div class="relative">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="password"
                        placeholder="Masukkan password"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <!-- Tombol mata -->
                    <button
                        type="button"
                        @click="togglePassword"
                        class="absolute right-3 bottom-2 flex items-center text-gray-500 hover:text-purple-600 focus:outline-none"
                    >
                        <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
                    </button>
                </div>

                <button type="submit" class="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition cursor-pointer">
                    Login
                </button>
            </form>

            <p class="text-center text-sm text-gray-600 mt-6">
                Belum punya akun? <RouterLink :to="{name: 'Register'}" class="text-purple-400 font-medium hover:underline">Sini</RouterLink>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { Eye, EyeOff } from "lucide-vue-next"
import { useRoute, useRouter } from "vue-router"
import {useAuthStore} from "../../stores/auth.store"

const authStore= useAuthStore()
const router= useRouter()
const route= useRoute()

const showPassword= ref(false)
const togglePassword= ()=> {
    showPassword.value= !showPassword.value
}

const username= ref('')
const password= ref('')
const error= ref('')
const message= ref(route.query.message || '')

const handleLogin= async()=> {
    try {
        await authStore.login({username: username.value, password: password.value})

        if (authStore.role === 'admin'){
            router.push({name: 'DashboardAdmin'})
        }else if (authStore.role === 'author'){
            router.push({name: 'DashboardAuthor'})
        }else {
            router.push({name: 'Home'})
        }

    } catch (err) {
        error.value= err.response?.data?.error || 'Login gagal!'
    }
}

</script>