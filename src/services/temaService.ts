import type { Tema } from "@/interfaces/tema";
import api from "@/services/api";

export const temaService = {
    getAll() {
        return api.get("/temas");
    },

    getById(id: number) {
        return api.get(`/temas/${id}`);
    },

    create(datos: Tema) {
        return api.post("/temas", datos);
    },

    update(id: number, datos: Tema) {
        return api.put(`/temas/${id}`, datos);
    },

    delete(id: number) {
        return api.delete(`/temas/${id}`);
    }
};
