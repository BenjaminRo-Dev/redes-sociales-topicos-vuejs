import api from './api'

export interface PublicarRequest {
    texto: string
    url_img?: string
    url_video?: string
}

export interface PublicarResponse {
    id: string
    enlace: string
}

export const publicarService = {
    async publicarFacebook(data: PublicarRequest): Promise<PublicarResponse> {
        const response = await api.post<PublicarResponse>('/publicar/facebook', {
            texto: data.texto,
            url_img: data.url_img
        })
        return response.data
    },

    async publicarInstagram(data: PublicarRequest): Promise<PublicarResponse> {
        const response = await api.post<PublicarResponse>('/publicar/instagram', {
            texto: data.texto,
            url_img: data.url_img
        })
        return response.data
    },

    async publicarLinkedin(data: PublicarRequest): Promise<PublicarResponse> {
        const response = await api.post<PublicarResponse>('/publicar/linkedin', {
            texto: data.texto,
            url_img: data.url_img
        })
        return response.data
    },

    async publicarWhatsapp(data: PublicarRequest): Promise<PublicarResponse> {
        const response = await api.post<PublicarResponse>('/publicar/whatsapp', {
            texto: data.texto,
            url_img: data.url_img
        })
        return response.data
    },

    async publicarTiktok(data: PublicarRequest): Promise<PublicarResponse> {
        const response = await api.post<PublicarResponse>('/publicar/tiktok', {
            texto: data.texto,
            url_video: data.url_video
        })
        return response.data
    }
}
