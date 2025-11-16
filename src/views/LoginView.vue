<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const cargando = ref(false)
const msjError = ref('')

const iniciarSesion = async () => {
  cargando.value = true
  msjError.value = ''
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (error) {
    msjError.value = 'Credenciales incorrectas'
    console.log(error)
  }
  cargando.value = false
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div class="text-center">
        <h2 class="text-2xl font-bold tracking-tight">Contenido Para Redes Sociales con LLM</h2>
        <p class="mt-2 text-sm text-gray-600">Iniciar Sesión</p>
      </div>

      <div class="mt-8 space-y-6">
        <div class="space-y-4">
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium leading-none"> Email </label>
            <Input v-model="email" type="email" required placeholder="Email" />
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium leading-none"> Password </label>
            <Input v-model="password" type="password" required placeholder="Password" />
          </div>
        </div>

        <Button @click="iniciarSesion" :disabled="cargando" class="w-full"> Login </Button>
      </div>
    </div>
  </div>
</template>
