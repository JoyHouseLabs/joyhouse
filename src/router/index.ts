import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sub-react',
    name: 'SubReact',
    component: () => import('../views/SubReact.vue')
  },
  {
    path: '/sub-vue',
    name: 'SubVue',
    component: () => import('../views/SubVue.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 