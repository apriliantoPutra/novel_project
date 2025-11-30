<template>
  <div class="flex flex-col items-center justify-center  text-center px-4">
    <div
      v-if="message"
      class="flex items-center justify-between bg-purple-100 border border-purple-300 text-purple-700 px-4 py-3 rounded-lg mb-6 max-w-lg w-full relative"
      role="alert"
    >
      <span>{{ message }}</span>
      <button
        @click="message = ''"
        class="ml-4 text-purple-600 hover:text-purple-800 focus:outline-none"
      >
        ✖
      </button>
    </div>

    <!-- Judul -->
    <h1 class="text-4xl sm:text-5xl font-extrabold text-purple-700 mb-4">
      Selamat Datang di <span class="text-purple-500">NovelApp</span>
    </h1>

    <!-- Keterangan -->
    <p class="text-gray-600 max-w-2xl mb-8 text-lg">
      Temukan, baca, dan nikmati berbagai novel menarik dari para penulis hebat.
      Baik kamu pembaca setia maupun penulis berbakat, semua ada di sini!
    </p>

    <!-- Tombol Aksi -->
    <div class="flex flex-col sm:flex-row gap-4">
      <RouterLink
        to="/novels"
        class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
      >
        📚 Jelajahi Novel
      </RouterLink>
      <RouterLink
        to="/register"
        class="border border-purple-600 text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition"
      >
        ✍️ Baca Gratis
      </RouterLink>
    </div>

    <!-- Gambar / ilustrasi opsional -->
    <div class="mt-10">
      <img
        src="/logo.png"
        alt="novel illustration"
        class="w-40 h-40 opacity-70 mx-auto"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const message = ref(route.query.message || "")
</script>


