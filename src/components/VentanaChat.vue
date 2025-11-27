<script setup lang="ts">
import EscritorChat from './EscritorChat.vue'
</script>

<template>
  <div class="h-full flex flex-col border rounded-lg">
    <div class="flex-1 p-4 overflow-y-auto min-h-0" ref="scrollEl">
      <!-- <MessageItem v-for="msg in chat.mensajes" :key="msg.id" :mensaje="msg" /> -->
    </div>

    <div class="p-4 border-t shrink-0">
      <EscritorChat :loading="true" />
    </div>
  </div>
</template>
