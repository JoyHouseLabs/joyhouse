<template>
  <div class="language-switcher">
    <el-dropdown @command="handleLanguageChange" trigger="click">
      <el-button type="primary" :loading="loading">
        {{ currentLanguage === 'zh-CN' ? '中文' : 'English' }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            :command="'zh-CN'"
            :disabled="loading || currentLanguage === 'zh-CN'"
          >
            <el-icon v-if="currentLanguage === 'zh-CN'"><check /></el-icon>
            中文
          </el-dropdown-item>
          <el-dropdown-item 
            :command="'en-US'"
            :disabled="loading || currentLanguage === 'en-US'"
          >
            <el-icon v-if="currentLanguage === 'en-US'"><check /></el-icon>
            English
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 加载遮罩 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="loading" class="loading-mask">
          <el-icon class="loading-icon" :size="24">
            <loading />
          </el-icon>
          <span>{{ t('language.switch.loading') }}</span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { ArrowDown, Check, Loading } from '@element-plus/icons-vue'
import { setLanguage } from '../i18n'

const { t, locale } = useI18n()
const loading = ref(false)
const currentLanguage = computed(() => locale.value)

const handleLanguageChange = async (lang) => {
  if (loading.value || lang === currentLanguage.value) return
  
  try {
    loading.value = true
    await setLanguage(lang)
    ElMessage.success(t('language.switch.success'))
  } catch (error) {
    console.error('切换语言失败:', error)
    ElMessage.error(t('language.switch.error'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.language-switcher {
  position: relative;
}

.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.loading-icon {
  margin-bottom: 10px;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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