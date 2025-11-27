<script setup lang="ts">
import { ref } from 'vue'
import EscritorChat from './EscritorChat.vue'
import { chatService } from '@/services/chatService'
import { publicarService } from '@/services/publicarService'
import type { Mensaje, ChatRequest } from '@/interfaces/chat'

const mensajes = ref<Mensaje[]>([])
const cargando = ref(false)
const urlImagenGenerada = ref<string>('')
const urlVideoGenerado = ref<string>('')

async function enviarMensaje(prompt: string, redesSociales: string[]) {
  // Agregar mensaje del usuario
  const mensajeUsuario: Mensaje = {
    id: Date.now().toString(),
    tipo: 'usuario',
    contenido: prompt,
    timestamp: new Date(),
  }
  mensajes.value.push(mensajeUsuario)

  cargando.value = true

  try {
    // Solicitud al backend
    const solicitud: ChatRequest = {
      prompt,
      redes_sociales: redesSociales,
      duracion_video: 4,
    }

    const respuesta = await chatService.generarContenido(solicitud)

    // Agregar mensaje del sistema con el tema
    mensajes.value.push({
      id: Date.now().toString() + '-tema',
      tipo: 'sistema',
      contenido: `Tema: ${respuesta.tema}`,
      timestamp: new Date(),
    })

    // Agregar mensajes para cada red social
    const redesSocialesDisponibles = ['facebook', 'instagram', 'linkedin', 'whatsapp', 'tiktok']

    for (const redSocial of redesSocialesDisponibles) {
      const contenido = respuesta[redSocial as keyof typeof respuesta]
      if (contenido && typeof contenido === 'object' && 'texto' in contenido) {
        mensajes.value.push({
          id: Date.now().toString() + '-' + redSocial,
          tipo: 'red_social',
          redSocial: redSocial,
          contenido: contenido.texto,
          hashtags: contenido.hashtags,
          timestamp: new Date(),
        })
      }
    }

    // Generar imagen
    if (respuesta.prompt_imagen) {
      mensajes.value.push({
        id: Date.now().toString() + '-generando-imagen',
        tipo: 'sistema',
        contenido: 'Generando imagen...',
        timestamp: new Date(),
      })

      try {
        const imagenData = await chatService.generarImagen(respuesta.prompt_imagen)
        console.log('Datos de imagen recibidos:', imagenData)
        urlImagenGenerada.value = `http://localhost:8000/${imagenData.url_imagen}`
        mensajes.value.push({
          id: Date.now().toString() + '-imagen',
          tipo: 'imagen',
          contenido: 'Imagen generada',
          urlImagen: urlImagenGenerada.value,
          promptImagen: imagenData.prompt,
          timestamp: new Date(),
        })
      } catch (error) {
        console.error('Error generando imagen:', error)
        mensajes.value.push({
          id: Date.now().toString() + '-error-imagen',
          tipo: 'sistema',
          contenido: `Error al generar la imagen: ${error}`,
          timestamp: new Date(),
        })
      }
    }

    // Generar video
    if (respuesta.prompt_video) {
      mensajes.value.push({
        id: Date.now().toString() + '-generando-video',
        tipo: 'sistema',
        contenido: 'Generando video...',
        timestamp: new Date(),
      })

      try {
        const videoData = await chatService.generarVideo(
          respuesta.prompt_video,
          solicitud.duracion_video,
        )
        console.log('Datos de video recibidos:', videoData)
        urlVideoGenerado.value = `http://localhost:8000/${videoData.url_video}`
        mensajes.value.push({
          id: Date.now().toString() + '-video',
          tipo: 'video',
          contenido: 'Video generado',
          urlVideo: urlVideoGenerado.value,
          promptVideo: videoData.prompt,
          timestamp: new Date(),
        })
      } catch (error) {
        console.error('Error generando video:', error)
        mensajes.value.push({
          id: Date.now().toString() + '-error-video',
          tipo: 'sistema',
          contenido: `Error al generar el video: ${error}`,
          timestamp: new Date(),
        })
      }
    }
  } catch (error) {
    console.error('Error:', error)
    mensajes.value.push({
      id: Date.now().toString() + '-error',
      tipo: 'sistema',
      contenido: 'Error al generar el contenido',
      timestamp: new Date(),
    })
  } finally {
    cargando.value = false
  }
}

async function publicarEnRedSocial(mensaje: Mensaje) {
  if (!mensaje.redSocial) return

  // Marcar como publicando
  mensaje.publicando = true

  try {
    const redSocial = mensaje.redSocial.toLowerCase()
    let respuesta

    // Preparar datos según la red social
    if (redSocial === 'tiktok') {
      respuesta = await publicarService.publicarTiktok({
        texto: mensaje.contenido,
        url_video: urlVideoGenerado.value,
      })
    } else {
      const data = {
        texto: mensaje.contenido,
        url_img: urlImagenGenerada.value,
      }

      switch (redSocial) {
        case 'facebook':
          respuesta = await publicarService.publicarFacebook(data)
          break
        case 'instagram':
          respuesta = await publicarService.publicarInstagram(data)
          break
        case 'linkedin':
          respuesta = await publicarService.publicarLinkedin(data)
          break
        case 'whatsapp':
          respuesta = await publicarService.publicarWhatsapp(data)
          break
        default:
          throw new Error(`Red social no soportada: ${redSocial}`)
      }
    }

    // Guardar el enlace de la publicación
    mensaje.enlacePublicacion = respuesta.enlace
    console.log(`Publicado en ${mensaje.redSocial}:`, respuesta)
  } catch (error) {
    console.error(`Error publicando en ${mensaje.redSocial}:`, error)
    mensajes.value.push({
      id: Date.now().toString() + '-error-publicar',
      tipo: 'sistema',
      contenido: `Error al publicar en ${mensaje.redSocial}: ${error}`,
      timestamp: new Date(),
    })
  } finally {
    mensaje.publicando = false
  }
}
</script>

<template>
  <div class="h-full flex flex-col border rounded-lg">
    <!-- Área de mensajes -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-if="mensajes.length === 0" class="text-center text-gray-500 mt-8">
        <p>No hay mensajes. Empezá una conversación.</p>
      </div>

      <div v-for="mensaje in mensajes" :key="mensaje.id" class="mensaje">
        <!-- Mensaje del usuario -->
        <div v-if="mensaje.tipo === 'usuario'" class="flex justify-end">
          <div class="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]">
            <p>{{ mensaje.contenido }}</p>
            <span class="text-xs opacity-75">{{ mensaje.timestamp.toLocaleTimeString() }}</span>
          </div>
        </div>

        <!-- Mensaje del sistema -->
        <div v-else-if="mensaje.tipo === 'sistema'" class="flex justify-center">
          <div class="bg-gray-200 text-gray-700 rounded-lg p-2 text-sm">
            {{ mensaje.contenido }}
          </div>
        </div>

        <!-- Mensaje de red social -->
        <div v-else-if="mensaje.tipo === 'red_social'" class="flex justify-start">
          <div class="bg-gray-100 rounded-lg p-3 max-w-[70%] border">
            <div class="font-semibold text-sm text-blue-600 mb-2 capitalize">
              {{ mensaje.redSocial }}
            </div>
            <p class="whitespace-pre-wrap">{{ mensaje.contenido }}</p>
            <div v-if="mensaje.hashtags" class="mt-2 text-sm text-blue-500">
              {{ mensaje.hashtags.join(' ') }}
            </div>

            <!-- Botón de publicar -->
            <div class="mt-3 flex gap-2 items-center">
              <button
                v-if="!mensaje.enlacePublicacion"
                @click="publicarEnRedSocial(mensaje)"
                :disabled="mensaje.publicando"
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {{ mensaje.publicando ? 'Publicando...' : 'Publicar' }}
              </button>

              <!-- Enlace de la publicación -->
              <a
                v-if="mensaje.enlacePublicacion"
                :href="mensaje.enlacePublicacion"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors inline-flex items-center gap-1"
              >
                Ver publicación
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            <span class="text-xs text-gray-500 mt-2 block">{{
              mensaje.timestamp.toLocaleTimeString()
            }}</span>
          </div>
        </div>

        <!-- Mensaje con imagen -->
        <div v-else-if="mensaje.tipo === 'imagen'" class="flex justify-start">
          <div class="bg-gray-100 rounded-lg p-3 max-w-[70%]">
            <p class="text-sm mb-2 font-semibold">{{ mensaje.contenido }}</p>
            <div v-if="mensaje.promptImagen" class="mb-2 text-xs text-gray-600 italic">
              <strong>Prompt:</strong> {{ mensaje.promptImagen }}
            </div>
            <div v-if="mensaje.urlImagen">
              <img
                :src="mensaje.urlImagen"
                alt="Imagen generada"
                class="rounded max-w-full h-auto"
                @error="(e) => console.error('Error cargando imagen:', mensaje.urlImagen)"
              />
              <p class="text-xs text-gray-400 mt-1 break-all">URL: {{ mensaje.urlImagen }}</p>
            </div>
            <p v-else class="text-red-500 text-sm">No se recibió URL de imagen</p>
            <span class="text-xs text-gray-500 mt-1 block">{{
              mensaje.timestamp.toLocaleTimeString()
            }}</span>
          </div>
        </div>

        <!-- Mensaje con video -->
        <div v-else-if="mensaje.tipo === 'video'" class="flex justify-start">
          <div class="bg-gray-100 rounded-lg p-3 max-w-[70%]">
            <p class="text-sm mb-2 font-semibold">{{ mensaje.contenido }}</p>
            <div v-if="mensaje.promptVideo" class="mb-2 text-xs text-gray-600 italic">
              <strong>Prompt:</strong> {{ mensaje.promptVideo }}
            </div>
            <div v-if="mensaje.urlVideo">
              <video
                :src="mensaje.urlVideo"
                controls
                class="rounded max-w-full h-auto"
                @error="(e) => console.error('Error cargando video:', mensaje.urlVideo)"
              >
                Tu navegador no soporta el elemento de video.
              </video>
              <p class="text-xs text-gray-400 mt-1 break-all">URL: {{ mensaje.urlVideo }}</p>
            </div>
            <p v-else class="text-red-500 text-sm">No se recibió URL de video</p>
            <span class="text-xs text-gray-500 mt-1 block">{{
              mensaje.timestamp.toLocaleTimeString()
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Área de entrada -->
    <div class="p-4 border-t shrink-0">
      <EscritorChat :cargando="cargando" @enviar="enviarMensaje" />
    </div>
  </div>
</template>

<style scoped>
.mensaje {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
