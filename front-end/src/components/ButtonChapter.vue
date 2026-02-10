<template>
    <div class="flex justify-between items-center px-4">
          <RouterLink 
            v-if="hasPrevChapter && prevChapterId"
            :to="{name: 'ChapterDetail', params: {id: prevChapterId} }"
            class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft class="w-5 h-5" />
            Prev Chapter
          </RouterLink>
          <div v-else class="invisible">
            <button class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft class="w-5 h-5" />
                Prev Chapter
            </button>
          </div>

          <RouterLink 
            v-if="hasNextChapter && nextChapterId"
            :to="{name: 'ChapterDetail', params: {id: nextChapterId} }"
            class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight class="w-5 h-5" />
            Next Chapter
          </RouterLink>
          <div v-else class="invisible">
            <button class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight class="w-5 h-5" />
                Next Chapter
            </button>
          </div>
        </div>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

defineProps({
    hasPrevChapter: {
        type: Boolean,
        default: false
    },
    hasNextChapter: {
        type: Boolean,
        default: false
    },
    prevChapterId: {
        type: [Number, String],
        default: null
    },
    nextChapterId: {
        type: [Number, String],
        default: null
    }

})
</script>