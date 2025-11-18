<script setup lang="ts">
const props = defineProps<{
  nombreRedSocial: string
  data: { texto: string; hashtags: string[] } | null
}>()

const emit = defineEmits(['clickRed'])

const iconos: Record<string, string> = {
  facebook: '📘',
  instagram: '📸',
  linkedin: '💼',
  whatsapp: '💬',
  tiktok: '🎵',
}

const icono = iconos[props.nombreRedSocial]
const redSocial = props.nombreRedSocial.charAt(0).toUpperCase() + props.nombreRedSocial.slice(1)

function clickRed() {
  emit('clickRed', props.nombreRedSocial)
  console.log(props.nombreRedSocial)
}
</script>

<template>
  <div v-if="data" class="p-4 bg-gray-100 mb-3 rounded-lg border-l-4 border-indigo-400">
    <h3 class="font-semibold text-gray-700 mb-2">{{ icono }} {{ redSocial }}</h3>

    <p class="whitespace-pre-wrap text-gray-600 mb-2">{{ data.texto }}</p>

    <div class="flex flex-wrap gap-2 mb-3">
      <span
        v-for="tag in data.hashtags"
        :key="tag"
        class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium"
      >
        {{ tag }}
      </span>
    </div>

    <button
      @click="clickRed"
      class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
    >
      Publicar en {{ redSocial }}
    </button>
  </div>
</template>
