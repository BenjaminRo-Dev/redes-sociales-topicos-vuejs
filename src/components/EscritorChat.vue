<script setup lang="ts">
import { ref, computed } from 'vue'
import { defineProps } from 'vue'
import Button from './ui/button/Button.vue'

const props = defineProps<{ cargando?: boolean }>()
const texto = ref('')

const vacio = computed(() => texto.value.trim().length === 0)

function enviar() {
  if (vacio.value || props.cargando) return
  console.log(texto)
}
</script>

<template>
  <form @submit.prevent="enviar" class="flex gap-2">
    <textoarea
      v-model="texto"
      rows="2"
      placeholder="Escribí tu mensaje..."
      class="flex-1 resize-none p-2 rounded border"
    />

    <Button :disabled="vacio || cargando" class="btn btn-primary" type="submit">
      <span v-if="!cargando">Enviar</span>
      <span v-else>Generando...</span>
    </Button>
  </form>
</template>
