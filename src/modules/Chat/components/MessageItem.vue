<script setup lang="ts">
import { computed } from 'vue'
import type { Mensaje } from '@/modules/Chat/interfaces'

const props = defineProps<{ mensaje: Mensaje }>()

const time = computed(() => new Date(props.mensaje.createdAt).toLocaleTimeString())
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
      <div
        class="inline-block px-4 py-2 rounded-lg shadow-sm bg-surface-1 max-w-full"
        v-html="mensaje.contenido"
      ></div>
      <div class="text-xs text-muted mt-1">{{ time }}</div>
    </div>
  </div>
</template>
