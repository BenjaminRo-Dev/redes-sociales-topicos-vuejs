import { defineStore } from 'pinia'
import { ref } from 'vue'
import { conversacionService } from '@/servicios/conversacionService'
import type { Conversaciones } from '@/interfaces/mis_interfaces'

export const useConversacionStore = defineStore('conversaciones', () => {

    const lista = ref<Conversaciones[]>([])
    const cargando = ref(false)
    const error = ref<string | null>(null)

    const obtenerConversaciones = async () => {
        try {
            cargando.value = true
            error.value = null

            const resp = await conversacionService.getAll()
            lista.value = resp.data

        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : 'Error al obtener conversaciones'
        } finally {
            cargando.value = false
        }
    }

    return {
        lista,
        cargando,
        error,
        obtenerConversaciones,
    }
})
