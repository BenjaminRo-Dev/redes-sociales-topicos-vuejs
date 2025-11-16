export type Rol = 'usuario' | 'asistente'

export interface Mensaje {
    id: string
    rol: Rol
    contenido: string
    createdAt: string
}

export interface RedSocialContent {
    texto: string
    hashtags: string[]
}

export interface RespuestaIA {
    tema: string
    facebook?: RedSocialContent
    instagram?: RedSocialContent
    linkedin?: RedSocialContent
    whatsapp?: RedSocialContent
    tiktok?: RedSocialContent
    message?: string
}