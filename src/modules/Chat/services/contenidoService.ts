import api from "@/services/api";
import type { Contenido } from "../interfaces";

const urlBase = "/chat/generar";

function formatearRespuesta(data: unknown): string | Contenido {
    if (typeof data === 'string') return data;
    const respuestaIA = data as Contenido;
    // Si tiene la estructura de Contenido, devolver el objeto
    if (respuestaIA.tema) {
        return respuestaIA;
    }
    // Fallback para otros tipos de respuesta
    return respuestaIA.message || JSON.stringify(respuestaIA);
}

export const contenidoService = {
    async generarContenido(prompt: string, redesSociales: string[]): Promise<string | Contenido> {
        const respuesta = await api.post(urlBase, {
            prompt,
            redes_sociales: redesSociales
        });

        return formatearRespuesta(respuesta.data);
    }

};
