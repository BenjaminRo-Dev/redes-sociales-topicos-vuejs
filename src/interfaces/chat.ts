export interface ChatRequest {
    prompt: string
    redes_sociales: string[]
    duracion_video?: number
}

export interface RedSocial {
    texto: string
    hashtags: string[]
}

export interface ChatResponse {
    tema: string
    prompt_imagen: string
    prompt_video: string
    facebook?: RedSocial
    instagram?: RedSocial
    linkedin?: RedSocial
    whatsapp?: RedSocial
    tiktok?: RedSocial
    url_imagen?: string
    url_video?: string
}

export interface Mensaje {
    id: string
    tipo: 'usuario' | 'sistema' | 'red_social' | 'imagen' | 'video'
    contenido: string
    redSocial?: string
    hashtags?: string[]
    urlImagen?: string
    urlVideo?: string
    promptImagen?: string
    promptVideo?: string
    enlacePublicacion?: string
    publicando?: boolean
    timestamp: Date
}
