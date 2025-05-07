<template>
  <div class="update-log">
    <h2>{{ $t('updateLog.title') }}</h2>
    
    <el-timeline>
      <el-timeline-item
        v-for="(release, index) in releases"
        :key="index"
        :timestamp="release.published_at"
        placement="top"
      >
        <el-card>
          <template #header>
            <div class="release-header">
              <h3>v{{ release.tag_name }}</h3>
              <el-tag size="small" type="success">{{ $t('updateLog.published') }}</el-tag>
            </div>
          </template>
          <div class="release-body" v-html="release.body"></div>
          <div class="release-footer">
            <el-button 
              v-if="release.assets.length > 0"
              type="primary" 
              size="small"
              @click="downloadRelease(release)"
            >
              {{ $t('updateLog.download') }}
            </el-button>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const releases = ref([])

// 获取更新日志
const fetchReleases = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/your-github-username/joyhouse/releases')
    releases.value = await response.json()
  } catch (error) {
    console.error(t('updateLog.fetchError'), error)
    ElMessage.error(t('updateLog.fetchError'))
  }
}

// 下载发布版本
const downloadRelease = (release) => {
  const asset = release.assets[0]
  if (asset) {
    window.open(asset.browser_download_url)
  }
}

onMounted(() => {
  fetchReleases()
})
</script>

<style scoped>
.update-log {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.release-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.release-header h3 {
  margin: 0;
  color: #409EFF;
}

.release-body {
  margin: 16px 0;
  line-height: 1.6;
}

.release-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style> 