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
      <ChatRespuesta v-if="isRespuestaIA" :respuesta="respuestaIA" />
      <div v-else class="inline-block px-4 py-2 rounded-lg shadow-sm bg-surface-1">
        {{ contenidoTexto }}
      </div>

      <div class="text-xs text-muted mt-1">{{ time }}</div>
    </div>
  </div>
</template>
