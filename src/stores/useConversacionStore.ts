import { defineStore } from 'pinia'
import { ref } from 'vue'
import { conversacionService } from '@/servicios/conversacionService'
import { imagenService } from '@/services/imagenService'
import { videoService } from '@/services/videoService'
import type { Conversaciones, Mensaje } from '@/interfaces/mis_interfaces'

export const useConversacionStore = defineStore('conversaciones', () => {

    const lista = ref<Conversaciones[]>([])
    const conversacionActiva = ref<Conversaciones | null>(null)
    const mensajes = ref<Mensaje[]>([])
    const cargando = ref(false)
    const cargandoMensajes = ref(false)
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

    const seleccionarConversacion = async (conversacion: Conversaciones) => {
        try {
            conversacionActiva.value = conversacion
            cargandoMensajes.value = true
            error.value = null

            if (conversacion.id) {
                const resp = await conversacionService.getMensajes(conversacion.id)
                mensajes.value = resp.data
            }
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : 'Error al obtener mensajes'
            mensajes.value = []
        } finally {
            cargandoMensajes.value = false
        }
    }

    const crearConversacion = async (titulo: string) => {
        try {
            cargando.value = true
            error.value = null

            const resp = await conversacionService.create({ titulo })
            lista.value.unshift(resp.data)

            // Seleccionar automáticamente la nueva conversación
            await seleccionarConversacion(resp.data)

            return resp.data
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : 'Error al crear conversación'
            throw e
        } finally {
            cargando.value = false
        }
    }

    const enviarMensaje = async (texto: string, redesSociales: string[], duracionVideo: number = 4) => {
        if (!conversacionActiva.value?.id) {
            error.value = 'No hay conversación activa'
            return
        }

        try {
            const resp = await conversacionService.agregarMensaje(
                conversacionActiva.value.id,
                { texto, redes_sociales: redesSociales, duracion_video: duracionVideo }
            )
            // El backend devuelve un array con el mensaje del usuario + los de la IA
            mensajes.value.push(...resp.data)

            // Procesar prompts de imagen y video de los mensajes de IA
            await procesarPrompts(resp.data, duracionVideo)

            return resp.data
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : 'Error al enviar mensaje'
            throw e
        }
    }

    const procesarPrompts = async (mensajesNuevos: Mensaje[], duracionVideo: number) => {
        if (!conversacionActiva.value?.id) return

        for (const mensaje of mensajesNuevos) {
            // Solo procesar mensajes de IA que tengan prompts
            if (mensaje.emisor !== 'ia') continue

            try {
                // Generar imagen si hay prompt_imagen
                if (mensaje.prompt_imagen) {
                    // Mostrar mensaje de carga
                    const mensajeCargaImagen: Mensaje = {
                        id: Date.now(),
                        emisor: 'ia',
                        texto: '🖼️ Generando imagen...',
                        red_social: mensaje.red_social,
                        conversacion_id: conversacionActiva.value.id,
                        create_at: new Date().toISOString()
                    }
                    mensajes.value.push(mensajeCargaImagen)

                    const respImagen = await imagenService.generarImagen(mensaje.prompt_imagen)

                    // Actualizar mensaje con la imagen generada
                    if (respImagen?.url_imagen) {
                        const index = mensajes.value.findIndex(m => m.id === mensajeCargaImagen.id)
                        if (index !== -1) {
                            mensajes.value[index].texto = '🖼️ Imagen generada'
                            mensajes.value[index].url_archivo = respImagen.url_imagen
                        }
                    }
                }

                // Generar video si hay prompt_video
                if (mensaje.prompt_video) {
                    // Mostrar mensaje de carga
                    const mensajeCargaVideo: Mensaje = {
                        id: Date.now() + 1,
                        emisor: 'ia',
                        texto: '🎥 Generando video...',
                        red_social: mensaje.red_social,
                        conversacion_id: conversacionActiva.value.id,
                        create_at: new Date().toISOString()
                    }
                    mensajes.value.push(mensajeCargaVideo)

                    const respVideo = await videoService.generarVideo(mensaje.prompt_video, duracionVideo)

                    // Actualizar mensaje con el video generado
                    if (respVideo?.url_video) {
                        const index = mensajes.value.findIndex(m => m.id === mensajeCargaVideo.id)
                        if (index !== -1) {
                            mensajes.value[index].texto = '🎥 Video generado'
                            mensajes.value[index].url_archivo = respVideo.url_video
                        }
                    }
                }
            } catch (e) {
                console.error('Error procesando prompts:', e)
                // No lanzar error para no interrumpir el flujo
            }
        }
    }

    const limpiarConversacionActiva = () => {
        conversacionActiva.value = null
        mensajes.value = []
    }

    return {
        lista,
        conversacionActiva,
        mensajes,
        cargando,
        cargandoMensajes,
        error,
        obtenerConversaciones,
        seleccionarConversacion,
        crearConversacion,
        enviarMensaje,
        limpiarConversacionActiva,
    }
})
