import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MyLayout from '@/layouts/MyLayout.vue'
// import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ChatView from '@/modules/Chat/ChatView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Iniciar Sesión' }
    },
    {
      path: '/',
      component: MyLayout,
      children: [
        { path: '', component: HomeView, meta: { title: 'Home', requiresAuth: true } },
        { path: 'chat', component: ChatView, meta: { title: 'Inicio', requiresAuth: true } },
        { path: 'about', component: AboutView, meta: { title: 'Acerca de', requiresAuth: true } },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) {
    return next("/login")
  }
  next()

})

export default router
