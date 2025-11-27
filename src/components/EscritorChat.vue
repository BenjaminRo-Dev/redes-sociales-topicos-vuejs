<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from './ui/button/Button.vue'

const props = defineProps<{ cargando?: boolean }>()
const emit = defineEmits<{
  enviar: [prompt: string, redesSociales: string[]]
}>()

const texto = ref('')
const redesSeleccionadas = ref<string[]>([
  'facebook',
  'instagram',
  'linkedin',
  'whatsapp',
  'tiktok',
])

const vacio = computed(() => texto.value.trim().length === 0)

const redesDisponibles = [
  { id: 'facebook', nombre: 'Facebook' },
  { id: 'instagram', nombre: 'Instagram' },
  { id: 'linkedin', nombre: 'LinkedIn' },
  { id: 'whatsapp', nombre: 'WhatsApp' },
  { id: 'tiktok', nombre: 'TikTok' },
]

function enviar() {
  if (vacio.value || props.cargando || redesSeleccionadas.value.length === 0) return

  emit('enviar', texto.value, redesSeleccionadas.value)
  texto.value = ''
}

function toggleRed(redId: string) {
  const index = redesSeleccionadas.value.indexOf(redId)
  if (index > -1) {
    redesSeleccionadas.value.splice(index, 1)
  } else {
    redesSeleccionadas.value.push(redId)
  }
}
</script>

<template>
  <div class="space-y-3">
    <!-- Selector de redes sociales -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="red in redesDisponibles"
        :key="red.id"
        @click="toggleRed(red.id)"
        :class="[
          'px-3 py-1 rounded-full text-sm border transition-colors',
          redesSeleccionadas.includes(red.id)
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
        ]"
        type="button"
      >
        {{ red.nombre }}
      </button>
    </div>

    <!-- Formulario de envío -->
    <form @submit.prevent="enviar" class="flex gap-2">
      <textarea
        v-model="texto"
        rows="2"
        placeholder="Escribí tu mensaje..."
        class="flex-1 resize-none p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="cargando"
      />

      <Button
        :disabled="vacio || cargando || redesSeleccionadas.length === 0"
        class="btn btn-primary self-end"
        type="submit"
      >
        <span v-if="!cargando">Enviar</span>
        <span v-else>Generando...</span>
      </Button>
    </form>

    <p v-if="redesSeleccionadas.length === 0" class="text-xs text-red-500">
      Seleccioná al menos una red social
    </p>
  </div>
</template>
