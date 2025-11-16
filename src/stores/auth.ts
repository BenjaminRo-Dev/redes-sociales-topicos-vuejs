import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../services/api";

export const useAuthStore = defineStore("auth", () => {
    const token = ref<string>("");

    async function login(email: string, password: string) {
        const respuesta = await api.post("/auth/login", { email, password });
        token.value = respuesta.data.access_token;
        localStorage.setItem("token", token.value);
    }

    function logout() {
        token.value = "";
        localStorage.removeItem("token");
    }

    return {
        token,
        login,
        logout,
    };
}, {
    persist: true
});
