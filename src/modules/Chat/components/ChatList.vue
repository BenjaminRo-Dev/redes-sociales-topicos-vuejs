<script setup lang="ts">
import { onMounted } from 'vue'
import { useTemaStore } from '@/stores/tema'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const temaStore = useTemaStore()

interface Props {
  temaActivo?: string
}

interface Emits {
  (e: 'seleccionar', tema: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

onMounted(async () => {
  if (temaStore.temas.length === 0) {
    await temaStore.fetchTemas()
  }
})

function seleccionarTema(nombreTema: string) {
  emit('seleccionar', nombreTema)
}

async function recargarTemas() {
  await temaStore.fetchTemas()
}
</script>

<template>
  <div class="h-full flex flex-col border rounded-lg overflow-hidden bg-background">
    <div class="p-4 border-b">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Temas de Chat</h2>
        <Button
          variant="ghost"
          size="sm"
          @click="recargarTemas"
          :disabled="temaStore.cargando"
          class="h-8 w-8 p-0"
        >
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
            :class="{ 'animate-spin': temaStore.cargando }"
          >
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
        </Button>
      </div>
    </div>

    <div class="flex-1 overflow-auto">
      <div v-if="temaStore.cargando" class="p-4 space-y-2">
        <Skeleton v-for="i in 5" :key="i" class="h-12 w-full" />
      </div>

      <div v-else-if="temaStore.error" class="p-4 text-center text-destructive">
        {{ temaStore.error }}
      </div>

      <div v-else-if="temaStore.temas.length === 0" class="p-4 text-center text-muted-foreground">
        No hay temas disponibles
      </div>

      <div v-else class="p-2">
        <Button
          v-for="tema in temaStore.temas"
          :key="tema.nombre"
          :variant="props.temaActivo === tema.nombre ? 'secondary' : 'ghost'"
          class="w-full justify-start mb-1 text-left"
          @click="seleccionarTema(tema.nombre)"
        >
          <div class="flex items-center gap-2 w-full">
            <div
              :class="{
                'bg-primary': props.temaActivo === tema.nombre,
                'bg-muted': props.temaActivo !== tema.nombre,
              }"
            ></div>
            <span class="truncate">{{ tema.nombre }}</span>
          </div>
        </Button>
      </div>
    </div>

    <Separator />

    <div class="p-3 text-xs text-muted-foreground text-center">
      {{ temaStore.temas.length }} tema(s) disponible(s)
    </div>
  </div>
</template>
