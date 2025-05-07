import { createI18n } from 'vue-i18n'

// 获取系统语言
const getSystemLanguage = () => {
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    return savedLanguage
  }
  
  const systemLanguage = navigator.language
  if (systemLanguage.startsWith('zh')) {
    return 'zh-CN'
  }
  return 'en-US'
}

// 语言包加载状态
const loadedLanguages = new Set()

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: getSystemLanguage(),
  fallbackLocale: 'en-US',
  messages: {}
})

// 动态加载语言包
export async function loadLanguageAsync(lang: string) {
  // 如果语言包已经加载，直接返回
  if (loadedLanguages.has(lang)) {
    return Promise.resolve()
  }

  try {
    // 动态导入语言包
    const messages = await import(`../locales/${lang}.ts`)
    i18n.global.setLocaleMessage(lang, messages.default)
    loadedLanguages.add(lang)
    return Promise.resolve()
  } catch (error) {
    console.error(`Failed to load language: ${lang}`, error)
    return Promise.reject(error)
  }
}

// 切换语言
export async function setLanguage(lang: string) {
  try {
    await loadLanguageAsync(lang)
    i18n.global.locale.value = lang
    localStorage.setItem('language', lang)
    return Promise.resolve()
  } catch (error) {
    console.error(`Failed to set language: ${lang}`, error)
    return Promise.reject(error)
  }
}

// 初始化加载默认语言
loadLanguageAsync(getSystemLanguage())

export default i18n 