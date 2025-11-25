import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const usePublicarStore = defineStore('publicar', () => {
    const cargando = ref(false)

    async function publicarContenido(texto: string, redSocial: string) {
        cargando.value = true

        try {
            const respuesta = await api.post(`/publicar/${redSocial}`, {
                texto,
                url_img: 'https://i.pinimg.com/1200x/e8/80/9f/e8809ffc17ab5ba4b6a50f01110469f2.jpg'
            })

            return respuesta.data
        } catch (err) {
            console.error('Error al publicar:', err)
            throw err
        } finally {
            cargando.value = false
        }
    }

    return { cargando, publicarContenido }
})
