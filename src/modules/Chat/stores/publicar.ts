import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const usePublicarStore = defineStore('publicar', () => {
    const cargando = ref(false)

    async function publicarContenido(texto: string, redSocial: string, mediaUrl: string | null = null) {
        cargando.value = true

        try {
            const url = mediaUrl || 'https://i.pinimg.com/1200x/e8/80/9f/e8809ffc17ab5ba4b6a50f01110469f2.jpg'
            let respuesta

            switch (redSocial) {
                case 'facebook':
                case 'instagram':
                    // JSON con texto y url_img
                    respuesta = await api.post(`/publicar/${redSocial}`, {
                        texto,
                        url_img: url
                    })
                    break

                case 'linkedin':
                    // JSON con imagen_ruta y texto
                    respuesta = await api.post(`/publicar/${redSocial}`, {
                        imagen_ruta: url,
                        texto
                    })
                    break

                case 'whatsapp':
                    // Query params
                    respuesta = await api.post(`/publicar/${redSocial}`, null, {
                        params: {
                            imagen_url: url,
                            texto
                        }
                    })
                    break

                case 'tiktok':
                    // Query params con texto y video_url
                    if (!mediaUrl) {
                        throw new Error('TikTok requiere un video generado')
                    }

                    respuesta = await api.post(`/publicar/${redSocial}`, null, {
                        params: {
                            texto,
                            video_url: mediaUrl
                        }
                    })
                    break

                default:
                    throw new Error(`Red social no soportada: ${redSocial}`)
            }

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
