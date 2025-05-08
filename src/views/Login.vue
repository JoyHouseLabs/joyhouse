<template>
  <div class="w-full h-screen flex md:flex-row flex-col">
    <!-- 左侧品牌与介绍 -->
    <div class="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#7f5fff] to-[#5b36d8] px-8 py-12">
      <div class="max-w-xl w-full flex flex-col items-center text-center">
        <div class="mb-6">
          <div class="mb-3 flex justify-center">
            <span class="text-4xl md:text-5xl">✨</span>
          </div>
          <div class="text-white text-2xl md:text-3xl font-bold mb-2 tracking-wide">培训助手</div>
          <div class="text-white/90 text-base md:text-lg mb-2">医疗法规培训与考核系统</div>
          <div class="text-white/80 mb-6">提供专业的医疗法规培训、考核和答疑服务，助力医疗从业人员提升专业素养</div>
        </div>
        <div class="w-full flex md:flex-row flex-col gap-4">
          <div class="flex-1 bg-white/90 rounded-lg px-4 py-5 flex flex-col items-center shadow">
            <div class="text-[#7f5fff] font-semibold mb-1">专业培训</div>
            <div class="text-gray-500 text-sm">系统化的医疗法规培训课程</div>
          </div>
          <div class="flex-1 bg-white/90 rounded-lg px-4 py-5 flex flex-col items-center shadow">
            <div class="text-[#7f5fff] font-semibold mb-1">在线考核</div>
            <div class="text-gray-500 text-sm">全流程知识考核智能匹配</div>
          </div>
          <div class="flex-1 bg-white/90 rounded-lg px-4 py-5 flex flex-col items-center shadow">
            <div class="text-[#7f5fff] font-semibold mb-1">智能答疑</div>
            <div class="text-gray-500 text-sm">AI即时解答专业问题</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧登录卡片 -->
    <div class="w-full md:w-[430px] flex flex-col justify-center items-center bg-[#f8f9fd] relative">
      <div class="w-full max-w-[360px] mx-auto bg-white rounded-xl shadow-lg p-8 mt-16 md:mt-0 flex flex-col items-center">
        <div class="text-xl font-bold mb-2 text-gray-800">欢迎登录</div>
        <div class="text-gray-500 text-sm mb-6">请使用微信账号登录系统</div>
        <button class="w-full flex items-center justify-center gap-2 py-2 mb-4 bg-green-500 hover:bg-green-600 text-white rounded transition text-base font-medium shadow" @click="wxLogin">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.36 17.09c-1.15 0-2.08-.93-2.08-2.08s.93-2.08 2.08-2.08c1.15 0 2.08.93 2.08 2.08s-.93 2.08-2.08 2.08zm-6.72 0c-1.15 0-2.08-.93-2.08-2.08s.93-2.08 2.08-2.08c1.15 0 2.08.93 2.08 2.08s-.93 2.08-2.08 2.08zm3.36-12.09C6.73 5 2 9.02 2 14.09c0 2.18 1.07 4.16 2.92 5.73.24.19.57.23.84.08l2.01-1.14c.26-.15.61-.13.85.04 1.12.81 2.47 1.28 3.88 1.28 4.97 0 9-4.03 9-9 0-5.07-4.73-9.09-10.01-9.09zm.01 16.18c-1.15 0-2.08-.93-2.08-2.08s.93-2.08 2.08-2.08c1.15 0 2.08.93 2.08 2.08s-.93 2.08-2.08 2.08z"/></svg>
          微信登录
        </button>
        <div class="text-xs text-gray-400 mb-2 cursor-pointer hover:underline w-full text-center" @click="otherLogin">点击前往密码登录系统</div>
      </div>
      <div class="absolute bottom-4 left-0 w-full flex flex-col items-center text-xs text-gray-400">
        <div class="flex items-center gap-1 mb-1">
          <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 17v.01"/><rect width="18" height="14" x="3" y="7" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>
          安全登录，保护账户信息
        </div>
        <div>© 2025 培训助手·医疗法规培训与考核系统</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({ username: '', password: '' })

function wxLogin() {
  alert('TODO: 微信登录')
}
function otherLogin() {
  alert('TODO: 跳转到密码登录页')
}
function ethLogin() {
  // 以太坊钱包登录逻辑（可用 window.ethereum.request 等实现）
  alert('TODO: 以太坊钱包登录')
}
function solLogin() {
  // Solana 钱包登录逻辑
  alert('TODO: Solana 钱包登录')
}
function onSubmit() {
  // 用户名密码登录逻辑
  alert(`登录: ${form.value.username}`)
}
function register() {
  // 注册逻辑
  alert(`注册: ${form.value.username}`)
}
</script>

<style scoped>
/* 额外细节样式可用 unocss 原子类直接覆盖 */
.input {
  @apply border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400;
}
.input-bordered {
  @apply border-gray-300;
}
</style>
