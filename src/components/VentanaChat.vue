<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useConversacionStore } from '@/stores/useConversacionStore'
import EscritorChat from './EscritorChat.vue'

const store = useConversacionStore()
const scrollEl = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollEl.value) {
      scrollEl.value.scrollTop = scrollEl.value.scrollHeight
    }
  })
}

// Scroll automático cuando cambien los mensajes
watch(
  () => store.mensajes,
  () => {
    scrollToBottom()
  },
  { deep: true },
)

const formatearFecha = (fecha?: string) => {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
}

const obtenerIconoRedSocial = (redSocial?: string | null) => {
  const iconos: Record<string, string> = {
    facebook: '📘',
    instagram: '📷',
    linkedin: '💼',
    whatsapp: '💬',
    tiktok: '🎵',
  }
  return redSocial ? iconos[redSocial] || '📱' : ''
}

const obtenerNombreRedSocial = (redSocial?: string | null) => {
  const nombres: Record<string, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
    tiktok: 'TikTok',
  }
  return redSocial ? nombres[redSocial] || redSocial : ''
}

const esImagen = (url?: string | null) => {
  if (!url) return false
  const extensionesImagen = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
  return extensionesImagen.some((ext) => url.toLowerCase().includes(ext))
}

const esVideo = (url?: string | null) => {
  if (!url) return false
  const extensionesVideo = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
  return extensionesVideo.some((ext) => url.toLowerCase().includes(ext))
}
</script>

<template>
  <div class="h-full flex flex-col border rounded-lg">
    <!-- Header -->
    <div class="p-4 border-b bg-gray-50">
      <h2 v-if="store.conversacionActiva" class="font-semibold text-lg">
        {{ store.conversacionActiva.titulo }}
      </h2>
      <h2 v-else class="font-semibold text-lg text-gray-400">Selecciona una conversación</h2>
    </div>

    <!-- Mensajes -->
    <div class="flex-1 p-4 overflow-y-auto min-h-0" ref="scrollEl">
      <div
        v-if="!store.conversacionActiva"
        class="h-full flex items-center justify-center text-gray-400"
      >
        <div class="text-center">
          <svg
            class="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p>Selecciona una conversación para empezar</p>
        </div>
      </div>

      <div
        v-else-if="store.cargandoMensajes"
        class="h-full flex items-center justify-center text-gray-500"
      >
        Cargando mensajes...
      </div>

      <div
        v-else-if="!store.mensajes.length"
        class="h-full flex items-center justify-center text-gray-400"
      >
        No hay mensajes aún. ¡Inicia la conversación!
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="mensaje in store.mensajes"
          :key="mensaje.id"
          :class="['flex', mensaje.emisor === 'usuario' ? 'justify-end' : 'justify-start']"
        >
          <div
            :class="[
              'max-w-[70%] rounded-lg px-4 py-2',
              mensaje.emisor === 'usuario' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900',
            ]"
          >
            <!-- Badge de red social para mensajes de IA -->
            <div v-if="mensaje.emisor === 'ia' && mensaje.red_social" class="mb-2">
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                <span>{{ obtenerIconoRedSocial(mensaje.red_social) }}</span>
                <span>{{ obtenerNombreRedSocial(mensaje.red_social) }}</span>
              </span>
            </div>

            <!-- Contenido de texto -->
            <div class="text-sm whitespace-pre-wrap mb-2">{{ mensaje.texto }}</div>

            <!-- Indicador de carga (cuando el texto incluye "Generando...") -->
            <div v-if="mensaje.texto.includes('Generando')" class="flex items-center gap-2 mt-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span class="text-xs text-gray-500">Por favor espera...</span>
            </div>

            <!-- Imagen generada -->
            <div v-if="mensaje.url_archivo && esImagen(mensaje.url_archivo)" class="mt-2">
              <img
                :src="mensaje.url_archivo"
                :alt="mensaje.texto"
                class="max-w-full h-auto rounded-lg shadow-md border border-gray-300"
                loading="lazy"
              />
            </div>

            <!-- Video generado -->
            <div v-if="mensaje.url_archivo && esVideo(mensaje.url_archivo)" class="mt-2">
              <video
                :src="mensaje.url_archivo"
                controls
                class="max-w-full h-auto rounded-lg shadow-md border border-gray-300"
                preload="metadata"
              >
                Tu navegador no soporta videos.
              </video>
            </div>

            <div
              :class="[
                'text-xs mt-1',
                mensaje.emisor === 'usuario' ? 'text-blue-100' : 'text-gray-500',
              ]"
            >
              {{ formatearFecha(mensaje.create_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="p-4 border-t shrink-0">
      <EscritorChat :loading="store.cargandoMensajes" />
    </div>
  </div>
</template>
