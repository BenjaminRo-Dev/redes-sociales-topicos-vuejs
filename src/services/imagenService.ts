import api from "@/services/api";

export const imagenService = {
    generarImagen(prompt: string) {
        return api.post("/chat/generar/imagen", null, {
            params: { prompt }
        }).then(r => r.data);
    }
}
