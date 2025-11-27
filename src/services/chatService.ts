import api from './api'
import type { ChatRequest, ChatResponse } from '@/interfaces/chat'

export const chatService = {
    async generarContenido(solicitud: ChatRequest): Promise<ChatResponse> {
        const response = await api.post<ChatResponse>('/chat/generar', solicitud)
        return response.data
    },

    async generarImagen(prompt: string): Promise<{ url_imagen: string; prompt: string }> {
        const response = await api.post<{ url_imagen: string; prompt: string }>('/chat/generar/imagen', null, {
            params: { prompt }
        })
        return response.data
    },

    async generarVideo(prompt: string, duracionSegs: number = 4): Promise<{ url_video: string; prompt: string; ruta_completa: string }> {
        const response = await api.post<{ url_video: string; prompt: string; ruta_completa: string }>('/chat/generar/video', null, {
            params: { prompt, duracion_segs: duracionSegs }
        })
        return response.data
    }
}
