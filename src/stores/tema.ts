import type { Tema } from "@/interfaces/tema"
import { temaService } from "@/services/temaService"
import { defineStore } from "pinia"
import { ref } from "vue"


export const useTemaStore = defineStore('tema', () => {
    const temas = ref<Tema[]>([])
    const cargando = ref(false)
    const error = ref<string | null>(null)

    async function fetchTemas() {
        cargando.value = true
        error.value = null
        try {
            const respuesta = await temaService.getAll()
            temas.value = respuesta.data
        } catch (err) {
            error.value = 'Error al cargar los temas.'
            console.log(err);
        } finally {
            cargando.value = false
        }
    }

    return { temas, cargando, error, fetchTemas }
}, {
    // persist: true
})