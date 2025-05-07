import { createI18n } from 'vue-i18n'
import zhCNRaw from '../locales/zh-CN'
import enUSRaw from '../locales/en-US'

// 兼容 Electron 打包后 ESM/CJS 导入
const zhCN = (zhCNRaw as any).default || zhCNRaw
const enUS = (enUSRaw as any).default || enUSRaw

console.log('Initializing i18n...')
console.log('Loading language packs:', { zhCN, enUS })

type SupportedLocales = 'zh-CN' | 'en-US'

// 获取系统语言
const getSystemLanguage = (): SupportedLocales => {
  console.log('Getting system language...')
  // 优先使用本地存储的语言设置
  const savedLanguage = localStorage.getItem('language') as SupportedLocales
  console.log('Saved language from localStorage:', savedLanguage)
  
  if (savedLanguage && (savedLanguage === 'zh-CN' || savedLanguage === 'en-US')) {
    console.log('Using saved language:', savedLanguage)
    return savedLanguage
  }
  
  // 其次使用系统语言
  const systemLanguage = navigator.language
  console.log('System language:', systemLanguage)
  
  const finalLanguage = systemLanguage.startsWith('zh') ? 'zh-CN' : 'en-US'
  console.log('Final selected language:', finalLanguage)
  return finalLanguage
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  globalInjection: true, // 启用全局注入
  locale: getSystemLanguage(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  },
  silentTranslationWarn: true, // 禁用翻译警告
  silentFallbackWarn: true, // 禁用回退警告
  missingWarn: false, // 禁用缺失警告
  fallbackWarn: false, // 禁用回退警告
  runtimeOnly: false, // 允许在编译时进行翻译
  allowComposition: true, // 允许组合式API
  sync: true // 同步模式
})

// 确保语言包已加载
console.log('i18n instance created with locale:', i18n.global.locale.value)
console.log('Available messages:', Object.keys(i18n.global.messages.value))
console.log('Current messages:', i18n.global.messages.value[i18n.global.locale.value])

// 切换语言
export async function setLanguage(lang: SupportedLocales) {
  console.log('Setting language to:', lang)
  try {
    i18n.global.locale.value = lang
    localStorage.setItem('language', lang)
    console.log('Language set successfully')
    console.log('New messages:', i18n.global.messages.value[lang])
    return Promise.resolve()
  } catch (error) {
    console.error(`Failed to set language: ${lang}`, error)
    return Promise.reject(error)
  }
}

export default i18n 