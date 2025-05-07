<template>
  <div class="app">
    <LanguageSwitcher />
    <UpdateChecker />
    <ErrorAlert />
    <LoadingSpinner />
    <router-view />
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
  // 模拟加载状态
  appStore.setLoading(true)
  setTimeout(() => {
    appStore.setLoading(false)
  }, 1000)
})
</script>

<style scoped>
.app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.nav-menu {
  padding: 1rem;
  background: #f5f5f5;
}

.nav-menu a {
  margin-right: 1rem;
  text-decoration: none;
  color: #333;
}

.nav-menu a.router-link-active {
  color: #42b983;
  font-weight: bold;
}

.content {
  flex: 1;
  padding: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 