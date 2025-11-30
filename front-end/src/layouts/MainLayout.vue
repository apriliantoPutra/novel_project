<template>
    <div class="min-h-screen flex flex-col bg-gray-100 text-gray-800">
        <nav class="bg-purple-600 text-white shadow-md">
            <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <!-- Logo -->
                <RouterLink to="/" class="text-2xl font-bold tracking-wide hover:text-purple-200 transition">
                    <img
                        src="/logo.png"
                        alt="novel illustration"
                        class="w-11 opacity-70 mx-auto"
                    />
                </RouterLink>

                <!-- Desktop Menu -->
                <div class="hidden md:flex items-center space-x-6">
                    <RouterLink
                        to="/"
                        class="hover:text-purple-200 transition"
                        active-class="text-purple-300 font-semibold"
                    >
                        Home
                    </RouterLink>
                    <RouterLink
                        to="/novels"
                        class="hover:text-purple-200 transition"
                        active-class="text-purple-300 font-semibold"
                    >
                        List Novel
                    </RouterLink>

                    <template v-if="!user">    
                        <RouterLink
                            to="/login"
                            class="hover:text-purple-200 transition"
                            active-class="text-purple-300 font-semibold"
                        >
                            Login
                        </RouterLink>
                        <RouterLink
                            to="/register"
                            class="hover:text-purple-200 transition"
                            active-class="text-purple-300 font-semibold"
                        >
                            Register
                        </RouterLink>
                    </template>
                    <template v-else>
                        <span class="text-sm italic">Halo, {{ user.username }}</span>
                        <button 
                        @click="handleLogout"
                        class="bg-purple-800 px-3 py-1 rounded-lg text-sm hover:bg-purple-900 transition cursor-pointer">
                            Logout
                        </button>
                    </template>
                </div>

                <!-- Mobile button -->
                <button
                @click="toggleMenu"
                class="md:hidden focus:outline-none focus:ring-2 focus:ring-purple-300 rounded">
                    <svg
                    v-if="!isOpen"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

            </div>

            <!-- Mobile Menu -->
            <div
                v-show="isOpen"
                class="md:hidden bg-purple-700 text-white space-y-2 px-4 py-3 animate-slide-down"
            >
                <RouterLink
                    to="/"
                    class="block hover:text-purple-300"
                    @click="closeMenu"
                    >
                    Home
                </RouterLink>
                <RouterLink
                    to="/novels"
                    class="block hover:text-purple-300"
                    @click="closeMenu"
                    >
                    List Novel
                </RouterLink>

                <template v-if="!user">
                    <RouterLink
                        to="/login"
                        class="block hover:text-purple-300"
                        @click="closeMenu"
                        >
                        Login
                    </RouterLink>
                    <RouterLink
                        to="/register"
                        class="block hover:text-purple-300"
                        @click="closeMenu"
                        >
                        Register
                    </RouterLink>
                </template>
                <template v-else>
                    <p class="text-sm italic">Halo, {{ user.username }}</p>
                    <button
                        @click="handleLogout"
                        class="w-full bg-purple-900 rounded-lg py-2 mt-2 text-sm font-medium hover:bg-purple-950 transition"
                    >
                        Logout
                    </button>
                </template>
            </div>
        </nav>
        <main class="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6">
            <RouterView/>
        </main>
        <footer class="bg-purple-700 text-white text-center py-4 mt-auto">
            <p class="text-sm">&copy; 2025 NovelApp. Semua hak cipta dilindungi.</p>
        </footer>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue"
import { useRouter } from "vue-router"

const isOpen= ref(false)
const toggleMenu= ()=> {
    isOpen.value= !isOpen.value
}
const closeMenu = () => {
    isOpen.value= false
}

const user= ref(null)
const router= useRouter()

onMounted(()=> {
    const savedUser= localStorage.getItem("user")
    if(savedUser){
        user.value= JSON.parse(savedUser)
    }
})

const handleLogout= ()=> {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    user.value= null
    router.push({name: "Home", query: {message: "Kamu telah logout"} })
}

</script>