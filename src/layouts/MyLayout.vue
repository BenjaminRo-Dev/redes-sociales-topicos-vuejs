<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// Título dinámico desde meta.title
const route = useRoute()
const pageTitle = computed(() => route.meta.title ?? 'Página')
</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <main class="flex-1 flex flex-col min-h-screen">
      <!-- Encabezado -->
      <header class="border-b px-6 py-4 bg-background flex items-center gap-3">
        <SidebarTrigger />
        <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
      </header>

      <!-- Contenido -->
      <section class="flex-1 p-6">
        <div class="max-w-6xl mx-auto">
          <RouterView />
        </div>
      </section>
    </main>
  </SidebarProvider>
</template>
