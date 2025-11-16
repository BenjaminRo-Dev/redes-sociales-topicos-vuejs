<script setup lang="ts">
import ChatWindow from '@/modules/Chat/components/ChatWindows.vue'
</script>

<template>
  <div class="max-w-3xl mx-auto h-screen flex flex-col">
    <header class="py-4">
      <h1 class="text-2xl font-bold">Chat</h1>
    </header>

    <ChatWindow />
  </div>
</template>
