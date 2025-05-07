import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './game/scenes/MainScene'
import i18n from './i18n'

console.log('Starting application initialization...')

// 创建应用实例
const app = createApp(App)
console.log('Vue app instance created')

// 错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err)
  console.error('Error Info:', info)
}

// 配置全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason)
})

// 按顺序初始化插件
console.log('Initializing plugins...')
const pinia = createPinia()
app.use(pinia)
console.log('Pinia initialized')

// 确保i18n在其他插件之前初始化
app.use(i18n)
console.log('i18n initialized')

app.use(ElementPlus)
console.log('ElementPlus initialized')

// 先挂载路由
app.use(router)
console.log('Router mounted to app')

// 等待路由准备就绪后再挂载应用
console.log('Waiting for router to be ready...')
router.isReady().then(() => {
  console.log('Router is ready')
  // 确保i18n已经准备好
  if (i18n.global.locale.value) {
    console.log('i18n is ready with locale:', i18n.global.locale.value)
  }
  app.mount('#app')
  console.log('App mounted to DOM')
}).catch(err => {
  console.error('Router initialization failed:', err)
}) 