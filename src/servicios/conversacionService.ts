import type { Conversaciones } from "@/interfaces/mis_interfaces";
import api from "@/services/api";

const urlBase = "/conversaciones";

export const conversacionService = {
    getAll() {
        return api.get(urlBase);
    },

    // getById(id: number) {
    //     return api.get(`${urlBase}/${id}`);
    // },

    // create(datos: Tema) {
    //     return api.post(urlBase, datos);
    // },

    // update(id: number, datos: Tema) {
    //     return api.put(`${urlBase}/${id}`, datos);
    // },

    // delete(id: number) {
    //     return api.delete(`${urlBase}/${id}`);
    // }
};