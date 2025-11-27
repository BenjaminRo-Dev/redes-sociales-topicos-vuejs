import api from "@/services/api";

export const videoService = {
    generarVideo(prompt: string, duracionSegs: number = 4) {
        return api.post("/chat/generar/video", null, {
            params: {
                prompt,
                duracion_segs: duracionSegs
            }
        }).then(r => r.data);
    }
}