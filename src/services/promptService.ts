import type { Prompt } from "@/interfaces/prompt";
import api from "@/services/api";

const urlBase = "/prompts";

export const promptService = {
    getAll() {
        return api.get(urlBase);
    },

    getById(id: number) {
        return api.get(`${urlBase}/${id}`);
    },

    create(datos: Prompt) {
        return api.post(urlBase, datos);
    },

    update(id: number, datos: Prompt) {
        return api.put(`${urlBase}/${id}`, datos);
    },

    delete(id: number) {
        return api.delete(`${urlBase}/${id}`);
    }
};