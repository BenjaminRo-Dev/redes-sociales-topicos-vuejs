<script setup lang="ts">
import { useConversacionStore } from '@/stores/useConversacionStore'
import ListaConversaciones from '@/components/ListaConversaciones.vue'
import Button from '@/components/ui/button/Button.vue'
import VentanaChat from '@/components/VentanaChat.vue'

const store = useConversacionStore()

async function crearNuevoChat() {
  const titulo = `Nueva Conversación ${new Date().toLocaleDateString()}`
  await store.crearConversacion(titulo)
}
</script>

<template>
  <div class="h-screen flex flex-col p-4">
    <header class="pb-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Chat</h1>
        </div>
        <Button @click="crearNuevoChat" variant="default">Nuevo Chat </Button>
      </div>
    </header>

    <div class="flex-1 flex gap-4 min-h-0">
      <div class="w-80 shrink-0 h-full">
        <ListaConversaciones />
      </div>
      <div class="flex-1 min-w-0 h-full">
        <VentanaChat />
      </div>
    </div>
  </div>
</template>
