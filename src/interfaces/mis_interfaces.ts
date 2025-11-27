export interface Conversaciones {
    id?: number;
    titulo: string;
    usuario_id?: number;
    usuarioNombre?: string;
    create_at?: string;
    update_at?: string;
}

export interface Mensaje {
    id?: number;
    emisor: string;
    texto: string;
    red_social?: string | null;
    url_archivo?: string | null;
    publicado?: boolean;
    url_publicacion?: string | null;
    prompt_imagen?: string | null;
    prompt_video?: string | null;
    conversacion_id?: number;
    create_at?: string;
    update_at?: string;
}