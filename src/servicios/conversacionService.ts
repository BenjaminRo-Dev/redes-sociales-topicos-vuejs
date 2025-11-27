import type { Conversaciones, Mensaje } from "@/interfaces/mis_interfaces";
import api from "@/services/api";

const urlBase = "/conversaciones";

export const conversacionService = {
    getAll() {
        return api.get<Conversaciones[]>(urlBase);
    },

    getById(id: number) {
        return api.get<Conversaciones>(`${urlBase}/${id}`);
    },

    getMensajes(conversacionId: number) {
        return api.get<Mensaje[]>(`${urlBase}/${conversacionId}/mensajes`);
    },

    create(datos: { titulo: string }) {
        return api.post<Conversaciones>(urlBase, datos);
    },

    agregarMensaje(conversacionId: number, mensaje: { texto: string; redes_sociales: string[]; duracion_video?: number }) {
        return api.post<Mensaje[]>(`${urlBase}/${conversacionId}/mensajes`, mensaje);
    },

    update(id: number, datos: { titulo: string }) {
        return api.put<Conversaciones>(`${urlBase}/${id}`, datos);
    },

    delete(id: number) {
        return api.delete(`${urlBase}/${id}`);
    }
};