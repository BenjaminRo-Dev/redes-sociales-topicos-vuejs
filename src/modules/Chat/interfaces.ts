export type Rol = 'usuario' | 'asistente'

export interface Mensaje {
    id: string
    rol: Rol
    contenido: string | RespuestaIA
    createdAt: string
    url_imagen?: string
    url_video?: string
}

export interface RedSocialContent {
    texto: string
    hashtags: string[]
}

export interface RespuestaIA {
    tema: string
    prompt_imagen: string
    prompt_video: string
    facebook?: RedSocialContent
    instagram?: RedSocialContent
    linkedin?: RedSocialContent
    whatsapp?: RedSocialContent
    tiktok?: RedSocialContent
    message?: string
}