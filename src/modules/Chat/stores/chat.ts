import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Mensaje } from '@/modules/Chat/interfaces'
import { contenidoService } from '@/modules/Chat/services/contenidoService'
import { temaService } from '@/services/temaService'

export const useChatStore = defineStore('chat', () => {
    const mensajes = ref<Mensaje[]>([])
    const cargando = ref(false)
    const temaActual = ref<string | null>(null)

    const redesSociales = ref([
        "facebook",
        "instagram",
        // "linkedin",
        // "whatsapp",
        // "tiktok"
    ])

    function addLocalMessage(contenido: string) {
        mensajes.value.push({
            id: uuidv4(),
            rol: 'usuario',
            contenido,
            createdAt: new Date().toISOString()
        })
    }

    async function sendToServer(contenido: string) {
        cargando.value = true

        try {
            console.log('Generando contenido...');
            const textoIA = await contenidoService.generarContenido(contenido, redesSociales.value)

            // Si la respuesta tiene un tema y no hay tema actual, guardarlo
            if (typeof textoIA === 'object' && textoIA.tema && !temaActual.value) {
                console.log('Creando tema...');
                await temaService.create({ nombre: textoIA.tema }).catch(console.error)
                temaActual.value = textoIA.tema
            }

            mensajes.value.push({
                id: uuidv4(),
                rol: 'asistente',
                contenido: textoIA,
                createdAt: new Date().toISOString()
            })

            return textoIA
        } catch (err) {
            mensajes.value.push({
                id: uuidv4(),
                rol: 'asistente',
                contenido: 'Error: no se pudo obtener respuesta del servidor.',
                createdAt: new Date().toISOString()
            })
            throw err
        } finally {
            cargando.value = false
        }
    }


    function clear() {
        mensajes.value = []
        temaActual.value = null
    }

    function setTema(tema: string | null) {
        temaActual.value = tema
    }

    return { mensajes, cargando, temaActual, addLocalMessage, sendToServer, clear, setTema }
})