import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import UpdateLog from '../views/UpdateLog.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/update-log',
    name: 'UpdateLog',
    component: UpdateLog
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 