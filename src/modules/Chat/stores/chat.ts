import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Mensaje } from '@/modules/Chat/interfaces'
import { contenidoService } from '@/modules/Chat/services/contenidoService'
import { temaService } from '@/services/temaService'
import { promptService } from '@/services/promptService'
import { imagenService } from '@/services/imagenService'
import { videoService } from '@/services/videoService'

export const useChatStore = defineStore('chat', () => {
    const mensajes = ref<Mensaje[]>([])
    const cargando = ref(false)
    const temaActual = ref<string | null>(null)

    const redesSociales = ref([
        "facebook",
        "instagram",
        "linkedin",
        "whatsapp",
        "tiktok"
    ])

    function addLocalMessage(prompt: string) {
        mensajes.value.push({
            id: uuidv4(),
            rol: 'usuario',
            contenido: prompt,
            createdAt: new Date().toISOString()
        })
    }

    async function sendToServer(prompt: string) {
        cargando.value = true
        let temaRegistrado = null

        try {
            console.log('Generando contenido...');
            const textoIA = await contenidoService.generarContenido(prompt, redesSociales.value)

            // Si la respuesta tiene un tema y no hay tema actual, guardarlo
            if (typeof textoIA === 'object' && textoIA.tema && !temaActual.value) {
                console.log('Creando tema...');
                temaRegistrado = await temaService.create({ nombre: textoIA.tema }).catch(console.error)
                temaActual.value = textoIA.tema
            }

            // Crear el mensaje inmediatamente con el contenido de texto
            const mensajeId = uuidv4()
            const nuevoMensaje: Mensaje = {
                id: mensajeId,
                rol: 'asistente',
                contenido: textoIA,
                createdAt: new Date().toISOString()
            }

            mensajes.value.push(nuevoMensaje)
            cargando.value = false

            promptService.create({ descripcion: prompt, tema_id: temaRegistrado?.data.id }).catch(console.error)

            // Generar imagen y video en segundo plano
            if (typeof textoIA === 'object' && textoIA.prompt_imagen) {
                imagenService.generarImagen(textoIA.prompt_imagen)
                    .then(respuestaImagen => {
                        // Buscar el mensaje y actualizarlo
                        const mensaje = mensajes.value.find(m => m.id === mensajeId)
                        if (mensaje) {
                            mensaje.url_imagen = respuestaImagen.url_imagen
                            console.log('Imagen generada:', respuestaImagen.url_imagen);
                        }
                    })
                    .catch(error => console.error('Error generando imagen:', error))
            }

            if (typeof textoIA === 'object' && textoIA.prompt_video) {
                videoService.generarVideo(textoIA.prompt_video)
                    .then(respuestaVideo => {
                        // Buscar el mensaje y actualizarlo
                        const mensaje = mensajes.value.find(m => m.id === mensajeId)
                        if (mensaje) {
                            mensaje.url_video = respuestaVideo.url_video
                            console.log('Video generado:', respuestaVideo.url_video);
                        }
                    })
                    .catch(error => console.error('Error generando video:', error))
            }

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