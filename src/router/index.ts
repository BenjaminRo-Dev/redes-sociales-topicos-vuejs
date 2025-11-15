import { createRouter, createWebHistory } from 'vue-router'
import MyLayout from '@/layouts/MyLayout.vue'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MyLayout,
      children: [
        { path: '', component: HomeView, meta: { title: 'Inicio' } },
        { path: 'about', component: AboutView, meta: { title: 'Acerca de' } },
      ],
    }
  ],
})

export default router
