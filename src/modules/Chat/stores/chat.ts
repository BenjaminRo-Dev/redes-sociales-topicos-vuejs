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

    function formatearRespuesta(data: unknown): string {
        if (typeof data === 'string') return data

        const respuesta = data as RespuestaIA

        // Si tiene la estructura esperada de redes sociales
        if (respuesta.tema) {
            const iconos: Record<string, string> = {
                facebook: '📘',
                instagram: '📸',
                linkedin: '💼',
                whatsapp: '💬',
                tiktok: '🎵'
            }

            let html = `<div style="font-family: system-ui, -apple-system, sans-serif;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px 8px 0 0; margin-bottom: 16px;">
                    <h2 style="margin: 0; font-size: 20px; font-weight: 600;">📝 ${respuesta.tema}</h2>
                </div>`

            const redes: Array<keyof Omit<RespuestaIA, 'tema' | 'message'>> = ['facebook', 'instagram', 'linkedin', 'whatsapp', 'tiktok']

            redes.forEach((red) => {
                if (respuesta[red]) {
                    const redData = respuesta[red]!
                    html += `
                    <div style="margin-bottom: 24px; padding: 16px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea;">
                        <h3 style="margin: 0 0 12px 0; color: #333; font-size: 18px; font-weight: 600;">
                            ${iconos[red]} ${red.charAt(0).toUpperCase() + red.slice(1)}
                        </h3>
                        <div style="margin-bottom: 12px;">
                            <p style="margin: 0; color: #555; line-height: 1.6; white-space: pre-wrap;">${redData.texto}</p>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${redData.hashtags.map((tag: string) =>
                        `<span style="background: #e3e8ff; color: #667eea; padding: 4px 12px; border-radius: 16px; font-size: 14px; font-weight: 500;">${tag}</span>`
                    ).join('')}
                        </div>
                    </div>`
                }
            })

            html += '</div>'
            return html
        }

        // Fallback para otros tipos de respuestas
        return respuesta.message ?? JSON.stringify(data)
    }

    async function sendToServer(contenido: string) {
        cargando.value = true
        try {
            const respuesta = await api.post('/chat/generar', { "prompt": contenido, "redes_sociales": redesSociales.value })

            const textoIA = formatearRespuesta(respuesta.data)

            mensajes.value.push({
                id: uuidv4(),
                rol: 'asistente',
                contenido: textoIA,
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

//Nota: se está usando `uuid`. Instálalo: `npm i uuid` y sus tipos `npm i -D @types/uuid`.