<script lang="ts" setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '~/store'

const route = useRoute()
const router = useRouter()
const { logout, currentProfile, isLogin } = useLoginStore()

const pageList = [
  { name: '个人中心', path: '/home' },
  { name: '资料维护', path: '/home/profile' },
  { name: '预约挂号', path: '/home/book' },
  { name: '我的挂号', path: '/home/my-registers' },
  { name: '报告单', path: '/home/reports' },
  { name: '住院信息', path: '/home/hospital' },
  { name: '评价医生', path: '/home/review' },
]

const activePath = computed(() => route.path)

function handelLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="border-b border-slate-200 bg-white shadow-sm">
      <div class="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-3">
        <ul class="flex flex-wrap items-center gap-6">
          <span class="text-lg font-bold text-teal-700">门诊患者端</span>
          <li v-for="item of pageList" :key="item.path">
            <RouterLink
              class="text-base text-slate-600 transition hover:text-teal-700"
              :class="{ '!font-semibold !text-teal-700': activePath === item.path }"
              :to="item.path"
            >
              {{ item.name }}
            </RouterLink>
          </li>
        </ul>
        <div class="flex items-center gap-2">
          <template v-if="isLogin">
            <n-text depth="2">
              {{ currentProfile?.displayName }}（{{ currentProfile?.username }}）
            </n-text>
            <n-button quaternary type="primary" @click="handelLogout">
              退出
            </n-button>
          </template>
          <n-button v-else type="primary" @click="$router.push('/login')">
            登录
          </n-button>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-[1200px] min-h-[calc(100vh-80px)] px-4 py-6">
      <RouterView />
    </div>
  </div>
</template>
