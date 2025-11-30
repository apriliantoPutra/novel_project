<template>
  <div class="min-h-screen bg-gray-50 flex flex-col p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-purple-700 mb-2">Selamat Datang, Author ✍️</h1>
      <p class="text-gray-600">Pantau aktivitas menulismu dan lihat perkembangan novelmu di sini.</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(item, index) in summary"
        :key="index"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition"
      >
        <div
          class="p-3 rounded-full"
          :class="item.bg"
        >
          <component :is="item.icon" class="w-6 h-6 text-white" />
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ item.label }}</p>
          <h2 class="text-xl font-semibold text-gray-800">{{ item.value }}</h2>
        </div>
      </div>
    </div>

    <!-- Motivational Section -->
    <div class="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col lg:flex-row items-center justify-between">
      <div class="mb-4 lg:mb-0">
        <h2 class="text-2xl font-semibold text-purple-700 mb-2">Terus Menulis & Berkarya 💪</h2>
        <p class="text-gray-600 max-w-lg">
          Setiap kata yang kamu tulis membawa pembaca ke dunia baru. Jangan berhenti menciptakan cerita luar biasa!
        </p>
      </div>
      <div class="flex gap-3">
        <button class="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
          <Plus class="inline w-5 h-5 mr-1" /> Tulis Novel Baru
        </button>
        <button class="px-5 py-2.5 border border-purple-600 text-purple-700 rounded-lg hover:bg-purple-50 transition">
          <BookOpen class="inline w-5 h-5 mr-1" /> Lihat Novelku
        </button>
      </div>
    </div>

    <!-- Activity Section -->
    <div class="mt-10">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Aktivitas Terakhir</h2>
      <ul class="space-y-3">
        <li
          v-for="(act, i) in activities"
          :key="i"
          class="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-3 hover:shadow-md transition"
        >
          <component :is="act.icon" class="w-5 h-5 text-purple-600" />
          <span class="text-gray-700">{{ act.text }}</span>
          <span class="ml-auto text-sm text-gray-500">{{ act.time }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { BookOpen, PenLine, Plus, Edit3, Clock } from "lucide-vue-next"

const summary = [
  { label: "Total Novel", value: 5, icon: BookOpen, bg: "bg-purple-500" },
  { label: "Total Chapter", value: 128, icon: PenLine, bg: "bg-indigo-500" },
  { label: "Komentar Masuk", value: 42, icon: Edit3, bg: "bg-pink-500" },
  { label: "Pembaca Aktif", value: "1.2K", icon: Clock, bg: "bg-amber-500" },
]

const activities = [
  { text: "Menambahkan Chapter 15 pada 'Bayangan di Senja Hari'", time: "2 jam lalu", icon: PenLine },
  { text: "Memperbarui sinopsis 'Langit Tanpa Batas'", time: "1 hari lalu", icon: Edit3 },
  { text: "Mendapat 10 komentar baru", time: "2 hari lalu", icon: BookOpen },
]
</script>
