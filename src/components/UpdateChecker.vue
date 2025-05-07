<template>
  <div class="update-checker" v-if="isElectron">
    <el-button 
      type="primary" 
      size="small"
      :loading="checking"
      @click="checkForUpdates"
    >
      {{ $t('update.check') }}
    </el-button>

    <!-- 更新进度对话框 -->
    <el-dialog
      v-model="showProgress"
      :title="$t('update.progress.title')"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="update-progress">
        <el-progress 
          :percentage="downloadProgress" 
          :status="downloadStatus"
        />
        <div class="progress-info">
          <span>{{ $t('update.progress.downloaded') }}: {{ formatSize(downloadedBytes) }}</span>
          <span>{{ $t('update.progress.total') }}: {{ formatSize(totalBytes) }}</span>
        </div>
        <div class="progress-speed">
          {{ $t('update.progress.speed') }}: {{ formatSpeed(downloadSpeed) }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUpdateStore } from '../stores/update'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'

const { t } = useI18n()
const updateStore = useUpdateStore()
const checking = ref(false)
const showProgress = ref(false)
const downloadProgress = ref(0)
const downloadStatus = ref('')
const downloadedBytes = ref(0)
const totalBytes = ref(0)
const downloadSpeed = ref(0)

// 检查是否在 Electron 环境中
const isElectron = ref(false)

// 检查更新
const checkForUpdates = async () => {
  if (checking.value) return
  
  try {
    checking.value = true
    
    // 检查是否在开发环境
    const isDev = import.meta.env.DEV
    if (isDev) {
      console.log(t('update.devMode'))
      // 模拟更新检查
      await new Promise(resolve => setTimeout(resolve, 1000))
      const hasUpdate = Math.random() > 0.5
      if (hasUpdate) {
        ElMessageBox.confirm(
          `${t('update.available')} v2.0.0\n${t('updateLog.title')}:\n1. ${t('update.newFeatures')}\n2. ${t('update.bugFixes')}`,
          t('update.title'),
          {
            confirmButtonText: t('update.install'),
            cancelButtonText: t('common.cancel'),
            type: 'info'
          }
        ).then(() => {
          ElMessage.success(t('update.success'))
        }).catch(() => {
          // 静默处理取消操作
        })
      }
      return
    }

    // 生产环境使用实际的更新检查
    if (!window.electron?.ipcRenderer) {
      return
    }

    const result = await window.electron.ipcRenderer.invoke('check-for-updates')
    if (!result) {
      return
    }

    if (result.hasUpdate) {
      ElMessageBox.confirm(
        `${t('update.available')} v${result.version}\n${result.releaseNotes || t('update.noReleaseNotes')}`,
        t('update.title'),
        {
          confirmButtonText: t('update.install'),
          cancelButtonText: t('common.cancel'),
          type: 'info'
        }
      ).then(() => {
        window.electron.ipcRenderer.send('start-update')
      }).catch(() => {
        // 静默处理取消操作
      })
    }
    // 如果没有更新，静默处理，不弹窗

  } catch (error) {
    // 静默处理所有错误
    console.log('Update check failed:', error)
    checking.value = false
  } finally {
    checking.value = false
  }
}

// 格式化文件大小
const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化下载速度
const formatSpeed = (bytesPerSecond) => {
  return formatSize(bytesPerSecond) + '/s'
}

// 监听更新事件
onMounted(() => {
  // 检查是否在 Electron 环境中
  isElectron.value = !!(window.electron?.ipcRenderer)
  
  if (!isElectron.value) {
    return
  }

  window.electron.ipcRenderer.on('download-progress', (progressObj) => {
    showProgress.value = true
    downloadProgress.value = Math.round(progressObj.percent || 0)
    downloadedBytes.value = progressObj.transferred || 0
    totalBytes.value = progressObj.total || 0
    downloadSpeed.value = progressObj.bytesPerSecond || 0
    downloadStatus.value = 'active'
  })

  window.electron.ipcRenderer.on('update-downloaded', () => {
    showProgress.value = false
    downloadProgress.value = 100
    downloadStatus.value = 'success'
  })

  window.electron.ipcRenderer.on('update-error', (error) => {
    showProgress.value = false
    downloadStatus.value = 'exception'
    // 静默处理，不弹窗
    if (process.env.NODE_ENV === 'development') {
      console.log('Update error:', error)
    }
  })
})
</script>

<style scoped>
.update-checker {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.update-progress {
  padding: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.progress-speed {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
  text-align: right;
}
</style> 