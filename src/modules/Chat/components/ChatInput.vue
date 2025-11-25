<script setup lang="ts">
import { ref, computed } from 'vue'
import { defineEmits, defineProps } from 'vue'

const emit = defineEmits<{
  (e: 'send', text: string): void
}>()

const props = defineProps<{ loading?: boolean }>()
const text = ref('')

const isEmpty = computed(() => text.value.trim().length === 0)

function onSubmit() {
  if (isEmpty.value || props.loading) return
  emit('send', text.value.trim())
  text.value = ''
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex gap-2">
    <textarea
      v-model="text"
      rows="2"
      placeholder="Escribí tu mensaje..."
      class="flex-1 resize-none p-2 rounded border"
    />

    <button :disabled="isEmpty || loading" class="btn btn-primary" type="submit">
      <span v-if="!loading">Enviar</span>
      <span v-else>Cargando...</span>
    </button>
  </form>
</template>
