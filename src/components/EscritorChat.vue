<script setup lang="ts">
import { ref, computed } from 'vue'
import { defineProps } from 'vue'
import { useConversacionStore } from '@/stores/useConversacionStore'
import Button from './ui/button/Button.vue'

const props = defineProps<{ loading?: boolean }>()
const store = useConversacionStore()
const texto = ref('')
const redesSeleccionadas = ref<string[]>(['facebook', 'instagram'])

const redesDisponibles = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'tiktok', label: 'TikTok' },
]

const vacio = computed(() => texto.value.trim().length === 0)
const enviando = ref(false)

const toggleRed = (red: string) => {
  const index = redesSeleccionadas.value.indexOf(red)
  if (index > -1) {
    redesSeleccionadas.value.splice(index, 1)
  } else {
    redesSeleccionadas.value.push(red)
  }
}

async function enviar() {
  if (
    vacio.value ||
    props.loading ||
    !store.conversacionActiva ||
    enviando.value ||
    redesSeleccionadas.value.length === 0
  )
    return

  const mensajeTexto = texto.value.trim()
  texto.value = ''
  enviando.value = true

  try {
    await store.enviarMensaje(mensajeTexto, redesSeleccionadas.value)
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <form @submit.prevent="enviar" class="space-y-3">
    <!-- Selector de Redes Sociales -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="red in redesDisponibles"
        :key="red.value"
        type="button"
        @click="toggleRed(red.value)"
        :class="[
          'px-3 py-1 rounded-full text-sm font-medium transition-colors',
          redesSeleccionadas.includes(red.value)
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
      >
        {{ red.label }}
      </button>
    </div>

    <!-- Input y Botón -->
    <div class="flex gap-2">
      <textarea
        v-model="texto"
        rows="2"
        placeholder="Escribí tu mensaje..."
        :disabled="!store.conversacionActiva || loading || enviando"
        class="flex-1 resize-none p-2 rounded border disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      <Button
        :disabled="
          vacio ||
          loading ||
          !store.conversacionActiva ||
          enviando ||
          redesSeleccionadas.length === 0
        "
        class="btn btn-primary"
        type="submit"
      >
        <span v-if="!enviando">Enviar</span>
        <span v-else>Generando...</span>
      </Button>
    </div>

    <p v-if="redesSeleccionadas.length === 0" class="text-sm text-red-500">
      Seleccioná al menos una red social
    </p>
  </form>
</template>
