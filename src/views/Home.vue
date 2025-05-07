<template>
  <div class="home">
    <div class="content">
      <h1>{{ t('home.welcome') }}222</h1>
      <div class="game-controls">
        <button 
          v-if="gameStatus === 'idle'" 
          @click="startGame"
          class="control-button"
        >
          {{ t('home.startGame') }}
        </button>
        <button 
          v-else-if="gameStatus === 'playing'" 
          @click="pauseGame"
          class="control-button"
        >
          {{ t('home.pauseGame') }}
        </button>
        <button 
          v-else 
          @click="resumeGame"
          class="control-button"
        >
          {{ t('home.resumeGame') }}
        </button>
      </div>
    </div>
    <div id="game-container"></div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/app'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const { gameStatus } = storeToRefs(appStore)

onBeforeMount(() => {
  console.log('Home component before mount')
  console.log('Current locale:', t('home.welcome'))
})

const startGame = () => {
  console.log('Starting game')
  appStore.setGameStatus('playing')
  // 这里可以添加游戏启动逻辑
}

const pauseGame = () => {
  console.log('Pausing game')
  appStore.setGameStatus('paused')
  // 这里可以添加游戏暂停逻辑
}

const resumeGame = () => {
  console.log('Resuming game')
  appStore.setGameStatus('playing')
  // 这里可以添加游戏继续逻辑
}

onMounted(() => {
  console.log('Home component mounted')
  console.log('Current route:', router.currentRoute.value)
  console.log('Current welcome text:', t('home.welcome'))
  try {
    // 初始化游戏场景
    appStore.setCurrentScene('MainScene')
    console.log('Game scene initialized')
  } catch (error) {
    console.error('Failed to initialize game scene:', error)
  }
})

onUnmounted(() => {
  console.log('Home component unmounted')
  // 清理游戏资源
  appStore.setGameStatus('idle')
})
</script>

<style scoped>
.home {
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: #ffffff;
}

.content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  z-index: 10;
  position: relative;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.game-controls {
  margin-bottom: 2rem;
  z-index: 10;
  position: relative;
}

.control-button {
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-button:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

#game-container {
  width: 100%;
  max-width: 800px;
  height: 600px;
  margin: 2rem auto;
  position: relative;
  z-index: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #2d2d2d;
}
</style> 