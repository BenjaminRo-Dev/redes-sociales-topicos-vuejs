<script setup lang="ts">
import { computed } from 'vue'
import type { Mensaje, RespuestaIA } from '@/modules/Chat/interfaces'
import ChatRespuesta from './ChatRespuesta.vue'

const props = defineProps<{ mensaje: Mensaje }>()

const time = computed(() => new Date(props.mensaje.createdAt).toLocaleTimeString())

const isRespuestaIA = computed(() => {
  return typeof props.mensaje.contenido === 'object' && props.mensaje.contenido !== null
})

const respuestaIA = computed(() => props.mensaje.contenido as RespuestaIA)
const contenidoTexto = computed(() => props.mensaje.contenido as string)

// Construir URL completa para la imagen
const imagenUrl = computed(() => {
  if (!props.mensaje.url_imagen) return null
  const apiUrl = import.meta.env.VITE_API_URL_PROD || 'http://localhost:8000'
  return `${apiUrl}/${props.mensaje.url_imagen}`
})

// Construir URL completa para el video
const videoUrl = computed(() => {
  if (!props.mensaje.url_video) return null
  const apiUrl = import.meta.env.VITE_API_URL_PROD || 'http://localhost:8000'
  return `${apiUrl}/${props.mensaje.url_video}`
})
</script>

<template>
  <div class="mb-3">
    <div v-if="mensaje.rol === 'usuario'" class="text-right">
      <div class="inline-block px-4 py-2 rounded-lg shadow-sm bg-surface-2">
        {{ mensaje.contenido }}
      </div>
      <div class="text-xs text-muted mt-1">{{ time }}</div>
    </div>

    <div v-else class="text-left">
      <ChatRespuesta
        v-if="isRespuestaIA"
        :respuesta="respuestaIA"
        :imagen-url="imagenUrl"
        :video-url="videoUrl"
      />
      <div v-else class="inline-block px-4 py-2 rounded-lg shadow-sm bg-surface-1">
        {{ contenidoTexto }}
      </div>

      <!-- Mostrar imagen si existe -->
      <div v-if="imagenUrl" class="mt-3 max-w-md">
        <img :src="imagenUrl" alt="Imagen generada" class="rounded-lg shadow-md w-full h-auto" />
      </div>

      <!-- Mostrar video si existe -->
      <div v-if="videoUrl" class="mt-3 max-w-md">
        <video :src="videoUrl" controls class="rounded-lg shadow-md w-full h-auto">
          Tu navegador no soporta el elemento de video.
        </video>
      </div>

      <div class="text-xs text-muted mt-1">{{ time }}</div>
    </div>
  </div>
</template>
