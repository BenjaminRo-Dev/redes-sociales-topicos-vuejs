import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { v4 as uuidv4 } from 'uuid'
import type { Mensaje, RespuestaIA } from '@/modules/Chat/interfaces'

export const useChatStore = defineStore('chat', () => {
    const mensajes = ref<Mensaje[]>([])
    const cargando = ref(false)

    const redesSociales = ref([
        "facebook",
        "instagram",
        "linkedin",
        "whatsapp",
        "tiktok"
    ])

    function addLocalMessage(contenido: string) {
        mensajes.value.push({
            id: uuidv4(),
            rol: 'usuario',
            contenido,
            createdAt: new Date().toISOString()
        })
    }

    function formatearRespuesta(data: unknown): string | RespuestaIA {
        if (typeof data === 'string') return data;
        const respuestaIA = data as RespuestaIA;
        // Si tiene la estructura de RespuestaIA, devolver el objeto
        if (respuestaIA.tema) {
            return respuestaIA;
        }
        // Fallback para otros tipos de respuesta
        return respuestaIA.message || JSON.stringify(respuestaIA);
    }


    async function sendToServer(contenido: string) {
        cargando.value = true
        console.log(redesSociales.value);
        // return
        try {
            const respuesta = await api.post('/chat/generar', { "prompt": contenido, "redes_sociales": redesSociales.value })

            const textoIA = formatearRespuesta(respuesta.data)

            mensajes.value.push({
                id: uuidv4(),
                rol: 'asistente',
                contenido: textoIA, // ahora es un objeto
                createdAt: new Date().toISOString()
            })

            return textoIA
        } catch (err) {
            // Manejo simple de error
            mensajes.value.push({
                id: uuidv4(),
                rol: 'asistente',
                contenido: 'Error: no se pudo obtener respuestauesta del servidor.',
                createdAt: new Date().toISOString()
            })
            throw err
        } finally {
            cargando.value = false
        }
    }


    function clear() {
        mensajes.value = []
    }


    return { mensajes, cargando, addLocalMessage, sendToServer, clear }
})