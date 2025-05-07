<template>
  <div class="home">
    <h1>欢迎来到JoyHouse</h1>
    <div class="game-controls">
      <button 
        v-if="gameStatus === 'idle'" 
        @click="startGame"
        class="control-button"
      >
        开始游戏
      </button>
      <button 
        v-else-if="gameStatus === 'playing'" 
        @click="pauseGame"
        class="control-button"
      >
        暂停游戏
      </button>
      <button 
        v-else 
        @click="resumeGame"
        class="control-button"
      >
        继续游戏
      </button>
    </div>
    <div id="game-container"></div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/app'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted } from 'vue'

const appStore = useAppStore()
const { gameStatus } = storeToRefs(appStore)

const startGame = () => {
  appStore.setGameStatus('playing')
  // 这里可以添加游戏启动逻辑
}

const pauseGame = () => {
  appStore.setGameStatus('paused')
  // 这里可以添加游戏暂停逻辑
}

const resumeGame = () => {
  appStore.setGameStatus('playing')
  // 这里可以添加游戏继续逻辑
}

onMounted(() => {
  // 初始化游戏场景
  appStore.setCurrentScene('MainScene')
})

onUnmounted(() => {
  // 清理游戏资源
  appStore.setGameStatus('idle')
})
</script>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.game-controls {
  margin-bottom: 2rem;
}

.control-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-button:hover {
  background-color: #3aa876;
}
</style> 