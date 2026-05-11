<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLoginStore, useRegistrationStore } from '~/store'

const router = useRouter()
const { list } = useRegistrationStore()
const { currentProfile } = useLoginStore()

const mine = computed(() =>
  list.value.filter(r => r.patient_id === currentProfile.value?.id && r.status !== 2),
)

const pending = computed(() => mine.value.filter(r => r.status === 0))
const unpaid = computed(() => mine.value.filter(r => r.is_paid === 0 && r.status === 0))
</script>

<template>
  <div>
    <n-h2 prefix="bar">
      个人中心
    </n-h2>
    <p class="mb-6 text-slate-600">
      欢迎使用门诊管理系统患者端。可在线预约挂号、查询记录、缴纳费用、查看报告与评价医生。
    </p>
    <n-grid :cols="3" :x-gap="16" :y-gap="16" responsive="screen">
      <n-gi>
        <n-card title="有效预约" embedded>
          <div class="text-3xl font-semibold text-teal-600">
            {{ pending.length }}
          </div>
          <n-button class="mt-3" text type="primary" @click="router.push('/home/my-registers')">
            查看我的挂号
          </n-button>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="待缴费用（挂号）" embedded>
          <div class="text-3xl font-semibold text-amber-600">
            {{ unpaid.length }}
          </div>
          <n-button class="mt-3" text type="primary" @click="router.push('/home/my-registers')">
            去支付
          </n-button>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="快捷入口" embedded>
          <n-space vertical>
            <n-button block secondary @click="router.push('/home/book')">
              预约挂号
            </n-button>
            <n-button block quaternary @click="router.push('/home/reports')">
              检验报告
            </n-button>
          </n-space>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
