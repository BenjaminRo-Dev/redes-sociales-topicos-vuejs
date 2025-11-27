import api from "@/services/api";
import type { RespuestaIA } from "../interfaces";

const urlBase = "/chat/generar";

function formatearRespuesta(data: unknown): string | RespuestaIA {
    if (typeof data === 'string') return data;
    const respuestaIA = data as RespuestaIA;
    // Si tiene la estructura de RespuestaIA, devolver el objeto
    if (respuestaIA.tema) {
        return respuestaIA;
    }
    // Fallback para otros tipos de respuesta
    return respuestaIA.message || JSON.stringify(respuestaIA);
}

export const contenidoService = {
    async generarContenido(prompt: string, redesSociales: string[]): Promise<string | RespuestaIA> {
        const respuesta = await api.post(urlBase, {
            prompt,
            redes_sociales: redesSociales
        });

        return formatearRespuesta(respuesta.data);
    }

};
