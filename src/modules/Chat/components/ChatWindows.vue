<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { useChatStore } from '@/modules/Chat/stores/chat'
import MessageItem from './MessageItem.vue'
import ChatInput from './ChatInput.vue'

const chat = useChatStore()
const scrollEl = ref<HTMLElement | null>(null)

function scrollToBottom() {
  nextTick(() => {
    if (!scrollEl.value) return
    scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  })
}

watch(
  () => chat.mensajes.length,
  () => scrollToBottom(),
)

onMounted(() => scrollToBottom())

async function handleSend(text: string) {
  chat.addLocalMessage(text)
  try {
    await chat.sendToServer(text)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="flex-1 flex flex-col border rounded-lg overflow-hidden">
    <div class="flex-1 p-4 overflow-auto" ref="scrollEl">
      <MessageItem v-for="msg in chat.mensajes" :key="msg.id" :mensaje="msg" />
    </div>

    <div class="p-4 border-t">
      <ChatInput @send="handleSend" :loading="chat.cargando" />
    </div>
  </div>
</template>
