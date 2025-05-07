import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { registerMicroApps, start } from 'qiankun'
import './game/scenes/MainScene'
import i18n from './i18n'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(i18n)
app.mount('#app')

// 注册微应用
registerMicroApps([
  {
    name: 'sub-react',
    entry: '//localhost:3001',
    container: '#sub-react',
    activeRule: '/sub-react'
  },
  {
    name: 'sub-vue',
    entry: '//localhost:3002',
    container: '#sub-vue',
    activeRule: '/sub-vue'
  }
])

// 启动 qiankun
start() 