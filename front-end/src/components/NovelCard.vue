<template>
    <div
        class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition"
      >
        <!-- Gambar -->
        <img
          :src="novel.cover_url"
          :alt="novel.title"
          class="w-full sm:w-48 h-48 sm:h-auto object-cover"
        />

        <!-- Info -->
        <div class="flex flex-col justify-between p-4 flex-1">
          <div>
            <h2 class="text-2xl font-semibold text-purple-700 mb-2">
                <RouterLink :to="{name: 'NovelDetail', params: {id: novel.id} }" >{{ novel.title }}</RouterLink>
            </h2>
            <div class="flex flex-wrap gap-2 mb-3">
                <span
                v-for="(genre, gIndex ) in novel.genres" :key="gIndex"
                :class="[
                'text-white text-xs font-semibold px-3 py-1 rounded-2xl ', getRandomColor()
                ]"
                >
                    {{ genre.name }}
                </span>
            </div>
            <ul class="space-y-1" v-if="novel.latest_chapters && novel.latest_chapters.length" >
              <li v-for="(chapters, cIndex) in novel.latest_chapters" :key="cIndex" >
                <RouterLink :to="{name: 'ChapterDetail', params:{id: chapters.id} }" class="text-gray-700 text-sm flex items-center justify-between border-b border-gray-100 pb-1">
                  <span class="font-medium">📖 Chapter {{ chapters.chapter_number }}: {{ chapters.title }} </span>
                  <span class="text-gray-500 text-xs">{{ formatTimeAgo(chapters.updated_at) }} </span>
                </RouterLink>
              </li>
            </ul>
            <ul v-else class="space-y-1" >
              <li class="text-gray-500 text-xs italic">
                Tidak ada chapter
              </li>
            </ul>
          </div>
        </div>
      </div>
</template>

<script setup>
import {getRandomColor, formatTimeAgo} from "../utils/helpers"
defineProps({
    novel: {
        type: Object,
    }
})

</script>