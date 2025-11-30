<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center md:text-left">
      <h1 class="text-3xl font-bold text-purple-700 mb-1">Dashboard Admin</h1>
      <p class="text-gray-600">Pantau aktivitas terbaru dan data sistem NovelApp</p>
    </div>

    <!-- Statistik Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(card, index) in stats"
        :key="index"
        class="bg-white rounded-xl shadow p-6 flex items-center justify-between hover:shadow-lg transition"
      >
        <div>
          <h3 class="text-gray-500 text-sm">{{ card.label }}</h3>
          <p class="text-2xl font-semibold text-purple-700">{{ card.value }}</p>
        </div>
        <div
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center text-white',
            card.bg
          ]"
        >
          <component :is="card.icon" class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Grafik Aktivitas (Dummy) -->
    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="text-xl font-semibold text-purple-700 mb-4">📈 Aktivitas Mingguan</h2>
      <div class="h-48 flex items-center justify-center text-gray-400 italic">
        (Grafik dummy di sini — nanti bisa diganti pakai Chart.js atau Recharts)
      </div>
    </div>

    <!-- Aktivitas Terbaru -->
    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="text-xl font-semibold text-purple-700 mb-4">🕓 Aktivitas Terbaru</h2>
      <ul class="divide-y divide-gray-100">
        <li
          v-for="(act, index) in activities"
          :key="index"
          class="py-4 flex justify-between items-center hover:bg-purple-50 px-2 rounded-md transition"
        >
          <div>
            <p class="font-medium text-gray-800">{{ act.text }}</p>
            <p class="text-sm text-gray-500">{{ act.time }}</p>
          </div>
          <span
            :class="[
              'text-xs font-semibold px-3 py-1 rounded-2xl',
              act.badge
            ]"
          >
            {{ act.type }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { UserIcon, BookOpenIcon, TagIcon, MessageSquareIcon } from "lucide-vue-next"

const stats = [
  { label: "Total Pengguna", value: "1,230", bg: "bg-purple-600", icon: UserIcon },
  { label: "Total Novel", value: "245", bg: "bg-indigo-500", icon: BookOpenIcon },
  { label: "Total Genre", value: "18", bg: "bg-pink-500", icon: TagIcon },
  { label: "Komentar", value: "4,120", bg: "bg-emerald-500", icon: MessageSquareIcon },
]

const activities = [
  {
    text: "Rina menambahkan novel *Bayangan di Balik Cermin*",
    time: "2 jam lalu",
    type: "Novel",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    text: "Admin menambahkan genre *Romance*",
    time: "1 hari lalu",
    type: "Genre",
    badge: "bg-pink-100 text-pink-700",
  },
  {
    text: "Doni mengomentari novel *Langit Senja*",
    time: "3 hari lalu",
    type: "Komentar",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    text: "User baru *Salsa_22* telah mendaftar",
    time: "5 hari lalu",
    type: "User",
    badge: "bg-indigo-100 text-indigo-700",
  },
]
</script>
