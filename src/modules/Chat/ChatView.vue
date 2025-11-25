<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ChatWindow from '@/modules/Chat/components/ChatWindows.vue'
import ChatList from '@/modules/Chat/components/ChatList.vue'
import { useChatStore } from '@/modules/Chat/stores/chat'
import { useTemaStore } from '@/stores/tema'
import { Button } from '@/components/ui/button'

const chatStore = useChatStore()
const temaStore = useTemaStore()
const temaSeleccionado = ref<string | undefined>(undefined)
const esNuevoChat = ref(false)

onMounted(async () => {
  // Cargar temas del servidor al montar el componente
  if (temaStore.temas.length === 0) {
    await temaStore.fetchTemas()
    crearNuevoChat()
  }
})

// Observar cuando el chatStore asigna un tema automáticamente
watch(
  () => chatStore.temaActual,
  (nuevoTema) => {
    if (nuevoTema && esNuevoChat.value) {
      console.log('creando nuevo tema')
      temaSeleccionado.value = nuevoTema
      esNuevoChat.value = false
      // Recargar temas para que aparezca en la lista si es nuevo
      temaStore.fetchTemas()
      // console.log('Lista de chats actualizada')
    }
  },
)

function handleSeleccionarTema(tema: string) {
  temaSeleccionado.value = tema
  esNuevoChat.value = false
  // Limpiar mensajes anteriores al cambiar de tema
  chatStore.clear()
  chatStore.setTema(tema)

  // Aquí podrías cargar los mensajes del tema seleccionado desde el servidor
  // Por ejemplo: await chatStore.loadMessagesForTema(tema)
}

function crearNuevoChat() {
  console.log('nuevo chat')
  temaSeleccionado.value = undefined
  esNuevoChat.value = true
  chatStore.clear()
}
</script>

<template>
  <div class="h-screen flex flex-col p-4">
    <header class="pb-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Chat</h1>
          <p v-if="temaSeleccionado" class="text-sm text-muted-foreground mt-1">
            Tema actual: <span class="font-medium">{{ temaSeleccionado }}</span>
          </p>
          <p v-else-if="esNuevoChat" class="text-sm text-muted-foreground mt-1">
            Nuevo chat - El tema se asignará automáticamente
          </p>
        </div>
        <Button @click="crearNuevoChat" variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Nuevo Chat
        </Button>
      </div>
    </header>

    <div class="flex-1 flex gap-4 min-h-0">
      <!-- Lista de temas -->
      <div class="w-80 shrink-0 h-full">
        <ChatList :tema-activo="temaSeleccionado" @seleccionar="handleSeleccionarTema" />
      </div>

      <!-- Ventana de chat -->
      <div class="flex-1 min-w-0 h-full">
        <ChatWindow />
      </div>
    </div>
  </div>
</template>
