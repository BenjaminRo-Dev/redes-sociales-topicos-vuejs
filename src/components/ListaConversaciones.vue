<script setup lang="ts">
import { onMounted } from 'vue'
import { useConversacionStore } from '@/stores/useConversacionStore'

const store = useConversacionStore()

onMounted(() => {
  store.obtenerConversaciones()
})
</script>

<template>
  <div>
    <div v-if="store.cargando">Cargando conversaciones...</div>
    <div v-if="store.error">{{ store.error }}</div>

    <ul v-if="store.lista.length">
      <li v-for="conversacion in store.lista" :key="conversacion.id">
        {{ conversacion.titulo }}
      </li>
    </ul>
  </div>
</template>
