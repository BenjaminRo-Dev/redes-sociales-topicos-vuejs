import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MyLayout from '@/layouts/MyLayout.vue'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

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
        { path: '', component: HomeView, meta: { title: 'Inicio', requiresAuth: true } },
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
