<script setup lang="ts">
import { onMounted } from 'vue'
import { useConversacionStore } from '@/stores/useConversacionStore'
import type { Conversaciones } from '@/interfaces/mis_interfaces'

const store = useConversacionStore()

onMounted(() => {
  store.obtenerConversaciones()
})

const seleccionar = (conversacion: Conversaciones) => {
  store.seleccionarConversacion(conversacion)
}
</script>

<template>
  <div class="h-full flex flex-col border rounded-lg">
    <div class="p-4 border-b">
      <h2 class="font-semibold text-lg">Conversaciones</h2>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="store.cargando" class="p-4 text-center text-gray-500">
        Cargando conversaciones...
      </div>

      <div v-else-if="store.error" class="p-4 text-center text-red-500">
        {{ store.error }}
      </div>

      <div v-else-if="!store.lista.length" class="p-4 text-center text-gray-500">
        No hay conversaciones
      </div>

      <ul v-else class="divide-y">
        <li
          v-for="conversacion in store.lista"
          :key="conversacion.id"
          @click="seleccionar(conversacion)"
          :class="[
            'p-4 cursor-pointer hover:bg-gray-100 transition-colors',
            store.conversacionActiva?.id === conversacion.id
              ? 'bg-blue-50 border-l-4 border-blue-500'
              : '',
          ]"
        >
          <div class="font-medium truncate">{{ conversacion.titulo }}</div>
          <div v-if="conversacion.create_at" class="text-xs text-gray-500 mt-1">
            {{ new Date(conversacion.create_at).toLocaleDateString() }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
