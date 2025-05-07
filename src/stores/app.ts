import { defineStore } from 'pinia'

interface AppState {
  loading: boolean
  error: string | null
  currentScene: string
  gameStatus: 'idle' | 'playing' | 'paused'
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    loading: false,
    error: null,
    currentScene: 'MainScene',
    gameStatus: 'idle'
  }),

  actions: {
    setLoading(status: boolean) {
      this.loading = status
    },

    setError(error: string | null) {
      this.error = error
    },

    setCurrentScene(scene: string) {
      this.currentScene = scene
    },

    setGameStatus(status: 'idle' | 'playing' | 'paused') {
      this.gameStatus = status
    },

    async handleError(error: unknown) {
      this.setError(error instanceof Error ? error.message : '未知错误')
      // 3秒后自动清除错误
      setTimeout(() => {
        this.setError(null)
      }, 3000)
    }
  }
}) 