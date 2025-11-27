<script setup lang="ts">
import ChatCardRed from '@/modules/Chat/components/ChatCardRed.vue'
import type { RespuestaIA } from '@/modules/Chat/interfaces'

defineProps<{
  respuesta: RespuestaIA
  imagenUrl: string | null
  videoUrl: string | null
}>()

const redes: Array<keyof Omit<RespuestaIA, 'tema' | 'message'>> = [
  'facebook',
  'instagram',
  'linkedin',
  'whatsapp',
  'tiktok',
]

const emit = defineEmits(['accion'])

function emitirAccion(red: string) {
  emit('accion', red)
}
</script>

<template>
  <div v-if="respuesta.tema" class="rounded-lg overflow-hidden shadow bg-white">
    <div class="p-4 text-white" style="background: linear-gradient(135deg, #667eea, #764ba2)">
      <h2 class="text-lg font-semibold">📝 {{ respuesta.tema }}</h2>
    </div>

    <ChatCardRed
      v-for="red in redes"
      :key="red"
      :nombreRedSocial="red"
      :data="(respuesta[red] as { texto: string; hashtags: string[] } | undefined) || null"
      :imagen-url="imagenUrl"
      :video-url="videoUrl"
      @clickRed="emitirAccion"
    />
  </div>

  <!-- fallback simple -->
  <div v-else>{{ respuesta.message || respuesta }}</div>
</template>
