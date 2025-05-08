import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
const Login = () => import('../views/Login.vue')

console.log('Initializing router...')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
   
]

console.log('Routes configured:', routes)

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

console.log('Router instance created')

// 添加导航守卫
router.beforeEach((to, from, next) => {
  console.log('Route change:', { from: from.path, to: to.path })
  console.log('Route component:', to.matched[0]?.components?.default)
  next()
})

router.afterEach((to) => {
  console.log('Route changed to:', to.path)
  console.log('Current route component:', to.matched[0]?.components?.default)
})

export default router 