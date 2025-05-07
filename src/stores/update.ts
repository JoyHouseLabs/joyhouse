import { defineStore } from 'pinia'

interface UpdateState {
  checking: boolean
  updateAvailable: boolean
  updateDownloaded: boolean
  error: string | null
}

export const useUpdateStore = defineStore('update', {
  state: (): UpdateState => ({
    checking: false,
    updateAvailable: false,
    updateDownloaded: false,
    error: null
  }),

  actions: {
    setChecking(status: boolean) {
      this.checking = status
    },

    setUpdateAvailable(status: boolean) {
      this.updateAvailable = status
    },

    setUpdateDownloaded(status: boolean) {
      this.updateDownloaded = status
    },

    setError(error: string | null) {
      this.error = error
    },

    async checkForUpdates() {
      try {
        this.setChecking(true)
        this.setError(null)
        await window.electronAPI.checkForUpdates()
      } catch (error) {
        this.setError(error instanceof Error ? error.message : '检查更新失败')
      } finally {
        this.setChecking(false)
      }
    }
  }
}) 