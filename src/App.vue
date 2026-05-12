<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { dateZhCN, zhCN } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from './store'

const theme: GlobalThemeOverrides = {
  common: {
    primaryColor: '#0d9488',
    primaryColorHover: '#0f766e',
    primaryColorPressed: '#115e59',
    primaryColorSuppl: '#14b8a6',
  },
}

const route = useRoute()
const router = useRouter()
const { currentRole } = useLoginStore()

const currentCheck = computed(() => `/${route.path.split('/')[1]}`)

function onSwitchEnd(path: string) {
  if (path !== currentCheck.value)
    router.push(path)
}
</script>

<template>
  <n-config-provider :theme-overrides="theme" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
