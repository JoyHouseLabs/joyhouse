<template>
  <div class="app"> 
    <LanguageSwitcher />
    <UpdateChecker />
    <ErrorAlert />
    <LoadingSpinner />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import UpdateChecker from './components/UpdateChecker.vue'
import ErrorAlert from './components/ErrorAlert.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { useAppStore } from './stores/app'
import { onMounted } from 'vue'

const appStore = useAppStore()

onMounted(() => {
  console.log('App mounted')
  // 模拟加载状态
  appStore.setLoading(true)
  setTimeout(() => {
    appStore.setLoading(false)
    console.log('App loading completed')
  }, 1000)
})
</script>

<style scoped>
html,
body {
  margin: 0;
  color-scheme: light;
  font-family: "Inter", "NotoSansSC", sans-serif, monospace;
  font-weight: 500;
  color: rgb(10, 10, 10);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  overflow: auto;
  overflow-x: scroll;
  height: 100%
}

#app {
  @apply w-full flex flex-col h-full;
}
</style> 