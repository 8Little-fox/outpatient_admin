<script lang="ts" setup>
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { useLoginStore } from '~/store'

function renderIcon(icon: string) {
  return () => h('span', { class: icon })
}

const { currentProfile, logout } = useLoginStore()
const router = useRouter()

const menuOptions: MenuOption[] = [
  { label: () => h(RouterLink, { to: '/doctor' }, '工作站首页'), key: 'doc-home', icon: renderIcon('icon-[icon-park-outline--home-two]') },
  { label: () => h(RouterLink, { to: '/doctor/queue' }, '待诊队列'), key: 'queue', icon: renderIcon('icon-[icon-park-outline--list]') },
  { label: () => h(RouterLink, { to: '/doctor/processed' }, '已处理挂号'), key: 'processed', icon: renderIcon('icon-[icon-park-outline--folder-success]') },
]

function handelLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <n-layout has-sider class="min-h-screen">
    <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="220">
      <div class="px-4 py-5 text-lg font-bold text-teal-700">
        医生工作站
      </div>
      <n-menu :options="menuOptions" :collapsed-width="64" :collapsed-icon-size="22" />
    </n-layout-sider>
    <n-layout>
      <div class="flex flex-col overflow-auto px-4 py-2">
        <header class="flex justify-between border-b border-slate-100 pb-2">
          <span class="text-slate-600">{{ currentProfile?.displayName }}（工号 {{ currentProfile?.username }}）</span>
          <n-popconfirm @positive-click="handelLogout">
            <template #trigger>
              <n-button quaternary>
                退出
              </n-button>
            </template>
            确认退出？
          </n-popconfirm>
        </header>
        <div class="flex-1 py-4">
          <RouterView />
        </div>
      </div>
    </n-layout>
  </n-layout>
</template>
